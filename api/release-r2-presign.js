import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const allowedArtifacts = new Map([
  ['chotu-darwin-arm64.dmg', 'application/x-apple-diskimage'],
  ['chotu-darwin-arm64.zip', 'application/zip'],
]);

const signedUrlTtlSeconds = 900;

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function normalizeR2EndpointAndBucket(endpoint, bucket) {
  let normalizedEndpoint = String(endpoint || '').replace(/\/+$/g, '');
  let normalizedBucket = String(bucket || '').trim();
  if (!normalizedEndpoint) return { endpoint: normalizedEndpoint, bucket: normalizedBucket };

  const parsed = new URL(normalizedEndpoint);
  const pathParts = parsed.pathname.split('/').filter(Boolean);
  if (pathParts.length === 1 && (!normalizedBucket || normalizedBucket === pathParts[0])) {
    normalizedBucket = pathParts[0];
    parsed.pathname = '';
    normalizedEndpoint = parsed.toString().replace(/\/+$/g, '');
  }

  return { endpoint: normalizedEndpoint, bucket: normalizedBucket };
}

function r2Config() {
  const accountId = process.env.CHOTU_R2_ACCOUNT_ID?.trim() || '';
  const rawEndpoint = (
    process.env.CHOTU_R2_ENDPOINT?.trim() || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '')
  ).replace(/\/+$/g, '');
  const normalized = normalizeR2EndpointAndBucket(rawEndpoint, process.env.CHOTU_R2_BUCKET);

  return {
    endpoint: normalized.endpoint || requireEnv('CHOTU_R2_ENDPOINT'),
    region: process.env.CHOTU_R2_REGION?.trim() || 'auto',
    bucket: normalized.bucket || requireEnv('CHOTU_R2_BUCKET'),
    accessKeyId: requireEnv('CHOTU_R2_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('CHOTU_R2_SECRET_ACCESS_KEY'),
  };
}

function r2Client(config) {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  });
}

function r2KeyForArtifact(artifact) {
  const prefix = (process.env.CHOTU_R2_RELEASE_PREFIX || 'chotu/releases/stable/0.1.0').replace(/^\/+|\/+$/g, '');
  return `${prefix}/${artifact}`;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

function requireUploadAuth(req) {
  const expected = requireEnv('CHOTU_RELEASE_UPLOAD_TOKEN');
  const header = req.headers.authorization || '';
  const actual = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : '';
  if (actual !== expected) throw new Error('Invalid release upload token');
}

async function handlePutPresign({ client, config, artifact }) {
  const key = r2KeyForArtifact(artifact);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });
  const url = await getSignedUrl(client, command, { expiresIn: signedUrlTtlSeconds });

  return {
    method: 'PUT',
    url,
    key,
    expiresIn: signedUrlTtlSeconds,
    headers: {},
  };
}

async function handleHead({ client, config, artifact }) {
  const key = r2KeyForArtifact(artifact);
  const head = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: key }));
  return {
    key,
    sizeBytes: head.ContentLength,
    contentType: head.ContentType,
    metadata: head.Metadata || {},
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    requireUploadAuth(req);
    const body = await readJson(req);
    const artifact = String(body.artifact || '').trim();
    if (!allowedArtifacts.has(artifact)) return res.status(400).json({ error: 'Unknown artifact' });

    const config = r2Config();
    const client = r2Client(config);
    const action = String(body.action || 'put').trim();
    if (action === 'put') return res.status(200).json(await handlePutPresign({ client, config, artifact }));
    if (action === 'head') return res.status(200).json(await handleHead({ client, config, artifact }));

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    const status = error.message === 'Invalid release upload token' ? 401 : 500;
    return res.status(status).json({ error: error.message });
  }
}
