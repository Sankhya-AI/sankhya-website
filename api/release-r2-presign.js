import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Bucket access, endpoint normalisation and key layout all come from ./_r2.js, the
// same module the public update feed reads through. They were duplicated here, which
// meant a Manu upload would have gone to Chotu's prefix while the feed looked for it
// under Manu's — a release uploaded to one place and read from another.
import { PRODUCTS, r2Client, r2Config, r2KeyForArtifact, requireEnv } from './_r2.js';

// One entry per product per platform. The names carry the product because the R2
// prefix is derived from them, which is what keeps Chotu's and Manu's releases from
// landing on each other.
const artifactContentTypes = new Map([
  ['dmg', 'application/x-apple-diskimage'],
  ['zip', 'application/zip'],
  // The signed update manifest ships with the artifacts it describes, so the
  // public feed can serve a release without a redeploy.
  ['update.json', 'application/json'],
]);

const allowedArtifacts = new Map(
  PRODUCTS.flatMap((product) =>
    [...artifactContentTypes].map(([suffix, contentType]) => [
      `${product}-darwin-arm64.${suffix}`,
      contentType,
    ]),
  ),
);

const signedUrlTtlSeconds = 900;

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
