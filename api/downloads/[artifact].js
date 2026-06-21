import crypto from 'node:crypto';
import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { admin, getAdminDb, requireEnv } from '../_firebase-admin.js';

const artifactBlobNames = new Map([
  ['chotu-darwin-arm64.dmg', 'chotu-darwin-arm64.dmg'],
  ['chotu-windows-x64.zip', 'chotu-windows-x64.zip'],
  ['chotu-win32-x64.zip', 'chotu-windows-x64.zip'],
]);

let cachedR2Client = null;
let cachedR2ClientKey = '';

function normalizeR2EndpointAndBucket(endpoint, bucket) {
  let normalizedEndpoint = String(endpoint || '').replace(/\/+$/g, '');
  let normalizedBucket = String(bucket || '').trim();
  if (!normalizedEndpoint) return { endpoint: normalizedEndpoint, bucket: normalizedBucket };

  try {
    const parsed = new URL(normalizedEndpoint);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length === 1 && (!normalizedBucket || normalizedBucket === pathParts[0])) {
      normalizedBucket = pathParts[0];
      parsed.pathname = '';
      normalizedEndpoint = parsed.toString().replace(/\/+$/g, '');
    }
  } catch {
    return { endpoint: normalizedEndpoint, bucket: normalizedBucket };
  }

  return { endpoint: normalizedEndpoint, bucket: normalizedBucket };
}

function r2Config() {
  const accountId = String(process.env.CHOTU_R2_ACCOUNT_ID || '').trim();
  const rawEndpoint = String(
    process.env.CHOTU_R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '')
  ).replace(/\/+$/g, '');
  const normalized = normalizeR2EndpointAndBucket(rawEndpoint, process.env.CHOTU_R2_BUCKET);
  const config = {
    endpoint: normalized.endpoint,
    region: String(process.env.CHOTU_R2_REGION || 'auto').trim() || 'auto',
    bucket: normalized.bucket,
    accessKeyId: String(process.env.CHOTU_R2_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: String(process.env.CHOTU_R2_SECRET_ACCESS_KEY || '').trim(),
  };
  const missing = Object.entries(config)
    .filter(([_key, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing Cloudflare R2 download configuration: ${missing.join(', ')}`);
  }
  return config;
}

function r2Client(config) {
  const clientKey = JSON.stringify({
    endpoint: config.endpoint,
    region: config.region,
    accessKeyId: config.accessKeyId,
  });
  if (cachedR2Client && cachedR2ClientKey === clientKey) return cachedR2Client;
  cachedR2ClientKey = clientKey;
  cachedR2Client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  });
  return cachedR2Client;
}

function r2KeyForArtifact(artifact) {
  const prefix = (process.env.CHOTU_R2_RELEASE_PREFIX || 'chotu/releases/stable/0.1.0').replace(/^\/+|\/+$/g, '');
  return `${prefix}/${artifactBlobNames.get(artifact)}`;
}

function contentTypeForArtifact(artifact) {
  return artifact.endsWith('.dmg') ? 'application/x-apple-diskimage' : 'application/zip';
}

function signedUrlTtlSeconds() {
  const value = Number(process.env.CHOTU_R2_SIGNED_URL_TTL_SECONDS || '300');
  if (!Number.isFinite(value) || value < 1) return 300;
  return Math.min(Math.floor(value), 3600);
}

export const __private = {
  normalizeR2EndpointAndBucket,
  r2KeyForArtifact,
  signedUrlTtlSeconds,
};

function signPayload(payload) {
  return crypto.createHmac('sha256', requireEnv('DOWNLOAD_TOKEN_SECRET')).update(payload).digest('base64url');
}

function verifyToken(token, artifact) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature) return null;
  const expected = signPayload(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (decoded.artifact !== artifact || decoded.exp <= Math.floor(Date.now() / 1000) || !decoded.jti || !decoded.uid) {
    return null;
  }

  return decoded;
}

async function isDownloadTokenAvailable(decoded) {
  const db = getAdminDb();
  const tokenRef = db.collection('downloadTokens').doc(decoded.jti);
  const snapshot = await tokenRef.get();
  const data = snapshot.data();
  const expiresAtMs = data?.expiresAt?.toMillis?.() ?? 0;

  return Boolean(
    snapshot.exists &&
      !data.usedAt &&
      data.uid === decoded.uid &&
      data.artifact === decoded.artifact &&
      expiresAtMs > Date.now()
  );
}

async function consumeDownloadToken(decoded) {
  const db = getAdminDb();
  const tokenRef = db.collection('downloadTokens').doc(decoded.jti);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(tokenRef);
    const data = snapshot.data();
    const expiresAtMs = data?.expiresAt?.toMillis?.() ?? 0;

    if (
      !snapshot.exists ||
      data.usedAt ||
      data.uid !== decoded.uid ||
      data.artifact !== decoded.artifact ||
      expiresAtMs <= Date.now()
    ) {
      return false;
    }

    transaction.update(tokenRef, {
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }

  try {
    const artifact = req.query.artifact;
    if (!artifactBlobNames.has(artifact)) return res.status(404).send('Unknown artifact');
    const decodedToken = verifyToken(req.query.token, artifact);
    if (!decodedToken || !(await isDownloadTokenAvailable(decodedToken))) {
      return res.status(401).send('Invalid, used, or expired download link');
    }

    const config = r2Config();
    const key = r2KeyForArtifact(artifact);
    const client = r2Client(config);

    try {
      await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: key }));
    } catch (error) {
      if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound') {
        return res.status(404).send('Release artifact is not available yet');
      }
      console.error(error);
      return res.status(502).send('Could not fetch release artifact');
    }

    const signedUrl = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${artifact}"`,
        ResponseContentType: contentTypeForArtifact(artifact),
      }),
      { expiresIn: signedUrlTtlSeconds() }
    );

    if (!(await consumeDownloadToken(decodedToken))) {
      return res.status(401).send('Invalid, used, or expired download link');
    }

    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    return res.redirect(302, signedUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Download failed');
  }
}
