import crypto from 'node:crypto';
import { get } from '@vercel/blob';
import { admin, getAdminDb, requireEnv } from '../_firebase-admin.js';

const allowedArtifacts = new Set(['chotu-darwin-arm64.zip', 'chotu-darwin-x64.zip', 'chotu-win32-x64.zip']);

function blobPathForArtifact(artifact) {
  const prefix = (process.env.CHOTU_BLOB_RELEASE_PREFIX || 'chotu/releases/stable/0.1.0').replace(/^\/+|\/+$/g, '');
  return `${prefix}/${artifact}`;
}

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
    if (!allowedArtifacts.has(artifact)) return res.status(404).send('Unknown artifact');
    const decodedToken = verifyToken(req.query.token, artifact);
    if (!decodedToken || !(await consumeDownloadToken(decodedToken))) {
      return res.status(401).send('Invalid, used, or expired download link');
    }

    const blob = await get(blobPathForArtifact(artifact), {
      access: 'private',
      token: requireEnv('BLOB_READ_WRITE_TOKEN'),
    });

    if (!blob) {
      return res.status(404).send('Release artifact is not available yet');
    }

    if (!blob.stream || blob.statusCode !== 200) {
      return res.status(502).send('Could not fetch release artifact');
    }

    res.setHeader('Content-Type', blob.blob.contentType || 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${artifact}"`);
    res.setHeader('Content-Length', String(blob.blob.size));
    res.setHeader('ETag', blob.blob.etag);
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const reader = blob.stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    return res.end();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Download failed');
  }
}
