import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';

import { __private } from '../api/downloads/[artifact].js';

beforeEach(() => {
  delete process.env.CHOTU_R2_RELEASE_PREFIX;
  delete process.env.CHOTU_R2_SIGNED_URL_TTL_SECONDS;
});

test('download route normalizes the Cloudflare bucket S3 URL', () => {
  assert.deepEqual(
    __private.normalizeR2EndpointAndBucket(
      'https://7bde7e018e7fa9eb5d03b9df2e66387b.r2.cloudflarestorage.com/chotu-bucket',
      ''
    ),
    {
      endpoint: 'https://7bde7e018e7fa9eb5d03b9df2e66387b.r2.cloudflarestorage.com',
      bucket: 'chotu-bucket',
    }
  );
});

test('download route keeps the existing release artifact keys', () => {
  process.env.CHOTU_R2_RELEASE_PREFIX = 'chotu/releases/stable/0.1.0';

  assert.equal(
    __private.r2KeyForArtifact('chotu-darwin-arm64.dmg'),
    'chotu/releases/stable/0.1.0/chotu-darwin-arm64.dmg'
  );
  assert.equal(
    __private.r2KeyForArtifact('chotu-win32-x64.zip'),
    'chotu/releases/stable/0.1.0/chotu-windows-x64.zip'
  );
});

test('download route caps signed URL TTL', () => {
  process.env.CHOTU_R2_SIGNED_URL_TTL_SECONDS = '9999';

  assert.equal(__private.signedUrlTtlSeconds(), 3600);
});
