// Shared R2 access for release artifacts.
//
// Both the authenticated upload presigner and the public update feed need the
// same bucket, the same key prefix, and the same endpoint normalisation. Keeping
// one copy means a release cannot be uploaded to one prefix and looked for under
// another.

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const DEFAULT_RELEASE_PREFIX = 'chotu/releases/stable/0.1.0';

export function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function normalizeR2EndpointAndBucket(endpoint, bucket) {
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

export function r2Config() {
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

export function r2Client(config) {
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

export function releasePrefix() {
  return (process.env.CHOTU_R2_RELEASE_PREFIX || DEFAULT_RELEASE_PREFIX).replace(/^\/+|\/+$/g, '');
}

export function r2KeyForArtifact(artifact) {
  return `${releasePrefix()}/${artifact}`;
}

export async function readR2Text(client, config, key) {
  const response = await client.send(new GetObjectCommand({ Bucket: config.bucket, Key: key }));
  return response.Body.transformToString();
}

export async function presignArtifactUrl(client, config, artifact, expiresIn) {
  const command = new GetObjectCommand({ Bucket: config.bucket, Key: r2KeyForArtifact(artifact) });
  return getSignedUrl(client, command, { expiresIn });
}
