import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';

import { stableStringify } from './_desktop-license.js';
import {
  dailyLimit,
  jinaApiKeys,
  readWithProviders,
  searchWithProviders,
  verifyEntitlementBearer,
} from './_web-providers.js';

const keyPair = crypto.generateKeyPairSync('ed25519');
const publicKeyPem = keyPair.publicKey.export({ type: 'spki', format: 'pem' });

function signedEntitlement(overrides = {}) {
  const payload = {
    schema_version: 'chotu.entitlement.v1',
    license_id: 'lic_test1',
    user_id: 'usr_test1',
    product_id: 'chotu',
    status: 'trialing',
    updates_until: new Date(Date.now() + 86_400_000).toISOString(),
    ...overrides,
  };
  const signature = crypto.sign(null, Buffer.from(stableStringify(payload), 'utf8'), keyPair.privateKey);
  return { ...payload, signature: `ed25519:${signature.toString('base64url')}` };
}

// Encode the way the Chotu hub does: compact, key-sorted JSON, unpadded base64url.
function bearerFor(entitlement) {
  const sorted = JSON.parse(stableStringify(entitlement));
  const compact = JSON.stringify(sorted);
  return `Bearer ${Buffer.from(compact, 'utf8').toString('base64url')}`;
}

test('verifyEntitlementBearer accepts a hub-encoded signed entitlement', () => {
  const identity = verifyEntitlementBearer(bearerFor(signedEntitlement()), { publicKeyPem });
  assert.equal(identity.licenseId, 'lic_test1');
  assert.equal(identity.status, 'trialing');
});

test('verifyEntitlementBearer rejects a tampered entitlement', () => {
  const entitlement = signedEntitlement();
  entitlement.status = 'active';
  assert.throws(
    () => verifyEntitlementBearer(bearerFor(entitlement), { publicKeyPem }),
    (error) => error.statusCode === 401,
  );
});

test('verifyEntitlementBearer rejects an expired plan window', () => {
  const entitlement = signedEntitlement({
    updates_until: new Date(Date.now() - 1000).toISOString(),
  });
  assert.throws(
    () => verifyEntitlementBearer(bearerFor(entitlement), { publicKeyPem }),
    (error) => error.statusCode === 403,
  );
});

test('verifyEntitlementBearer rejects inactive status and missing header', () => {
  const revoked = signedEntitlement({ status: 'canceled' });
  assert.throws(
    () => verifyEntitlementBearer(bearerFor(revoked), { publicKeyPem }),
    (error) => error.statusCode === 403,
  );
  assert.throws(() => verifyEntitlementBearer('', { publicKeyPem }), (error) => error.statusCode === 401);
});

function fetchScript(routes) {
  return async (url, options = {}) => {
    for (const [fragment, response] of Object.entries(routes)) {
      if (String(url).includes(fragment)) {
        return {
          ok: response.status < 400,
          status: response.status,
          json: async () => response.json,
          text: async () => response.text ?? '',
        };
      }
    }
    throw new Error(`unexpected fetch: ${url}`);
  };
}

test('searchWithProviders fails over from Jina to Firecrawl', async () => {
  const fetchImpl = fetchScript({
    's.jina.ai': { status: 401 },
    'api.firecrawl.dev': {
      status: 200,
      json: { data: { web: [{ title: 'Doc', url: 'https://a.dev', description: 'snippet' }] } },
    },
  });
  const { provider, results } = await searchWithProviders('chotu', 5, {
    fetchImpl,
    env: { JINA_API_KEY: 'jina-key', FIRECRAWL_API_KEY: 'fc-key' },
  });
  assert.equal(provider, 'firecrawl');
  assert.deepEqual(results, [{ title: 'Doc', url: 'https://a.dev', snippet: 'snippet' }]);
});

test('searchWithProviders reports missing configuration and total outage distinctly', async () => {
  await assert.rejects(
    searchWithProviders('chotu', 5, { fetchImpl: fetchScript({}), env: {} }),
    (error) => error.statusCode === 503 && error.code === 'no_provider_configured',
  );

  const outage = fetchScript({ 's.jina.ai': { status: 500 }, 'api.firecrawl.dev': { status: 402 } });
  await assert.rejects(
    searchWithProviders('chotu', 5, {
      fetchImpl: outage,
      env: { JINA_API_KEY: 'jina-key', FIRECRAWL_API_KEY: 'fc-key' },
    }),
    (error) => error.statusCode === 502 && error.code === 'search_unavailable',
  );
});

test('jinaApiKeys merges JINA_API_KEYS list with JINA_API_KEY and dedupes', () => {
  assert.deepEqual(jinaApiKeys({ JINA_API_KEYS: 'k1, k2', JINA_API_KEY: 'k2' }), ['k1', 'k2']);
  assert.deepEqual(jinaApiKeys({}), []);
});

test('searchWithProviders walks every Jina key before Firecrawl', async () => {
  const seenBearers = [];
  const fetchImpl = async (url, options = {}) => {
    if (String(url).includes('s.jina.ai')) {
      seenBearers.push(options.headers.Authorization);
      return seenBearers.length === 1
        ? { ok: false, status: 429, json: async () => ({}), text: async () => '' }
        : {
            ok: true,
            status: 200,
            json: async () => ({ data: [{ title: 'Doc', url: 'https://a.dev', description: 's' }] }),
            text: async () => '',
          };
    }
    throw new Error(`unexpected fetch: ${url}`);
  };
  const { provider, results } = await searchWithProviders('chotu', 5, {
    fetchImpl,
    env: { JINA_API_KEYS: 'key-one,key-two' },
  });
  assert.equal(provider, 'jina_2');
  assert.deepEqual(seenBearers, ['Bearer key-one', 'Bearer key-two']);
  assert.equal(results.length, 1);
});

test('searchWithProviders requires a query', async () => {
  await assert.rejects(
    searchWithProviders('   ', 5, { fetchImpl: fetchScript({}), env: { JINA_API_KEY: 'k' } }),
    (error) => error.statusCode === 400,
  );
});

test('readWithProviders fails over from Jina reader to scrape.do markdown', async () => {
  const fetchImpl = fetchScript({
    'r.jina.ai': { status: 429 },
    'api.scrape.do': { status: 200, text: '# Page body' },
  });
  const payload = await readWithProviders('https://a.dev/post', {
    fetchImpl,
    env: { JINA_API_KEY: 'jina-key', SCRAPE_DO_TOKEN: 'sd-token' },
  });
  assert.equal(payload.provider, 'scrape_do');
  assert.equal(payload.content, '# Page body');
  assert.equal(payload.truncated, false);
});

test('readWithProviders rejects non-http URLs', async () => {
  await assert.rejects(
    readWithProviders('file:///etc/passwd', { fetchImpl: fetchScript({}), env: {} }),
    (error) => error.statusCode === 400,
  );
});

test('dailyLimit falls back when env is absent or invalid', () => {
  assert.equal(dailyLimit({}, 'CHOTU_WEB_SEARCH_DAILY_LIMIT', 400), 400);
  assert.equal(dailyLimit({ CHOTU_WEB_SEARCH_DAILY_LIMIT: '25' }, 'CHOTU_WEB_SEARCH_DAILY_LIMIT', 400), 25);
  assert.equal(dailyLimit({ CHOTU_WEB_SEARCH_DAILY_LIMIT: '-1' }, 'CHOTU_WEB_SEARCH_DAILY_LIMIT', 400), 400);
});
