import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createProvisionedKey } from './_openrouter.js';

const originalFetch = globalThis.fetch;
const originalManagementKey = process.env.OPENROUTER_MANAGEMENT_API_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalManagementKey === undefined) delete process.env.OPENROUTER_MANAGEMENT_API_KEY;
  else process.env.OPENROUTER_MANAGEMENT_API_KEY = originalManagementKey;
});

test('managed desktop key is scoped, expiring, and created only by the management credential', async () => {
  process.env.OPENROUTER_MANAGEMENT_API_KEY = 'server-management-key';
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      status: 201,
      json: async () => ({ key: 'sk-or-account-key', data: { hash: 'account-key-hash' } }),
    };
  };

  const result = await createProvisionedKey('chotu_user', '20', '2026-08-13T00:00:00.000Z');
  const request = requests[0];
  const body = JSON.parse(request.options.body);

  assert.deepEqual(result, { key: 'sk-or-account-key', hash: 'account-key-hash' });
  assert.equal(request.url, 'https://openrouter.ai/api/v1/keys');
  assert.equal(request.options.headers.Authorization, 'Bearer server-management-key');
  assert.deepEqual(body, {
    name: 'chotu_user',
    expires_at: '2026-08-13T00:00:00.000Z',
    include_byok_in_limit: false,
    limit: 20,
    limit_reset: 'monthly',
  });
  assert.ok(!JSON.stringify(result).includes('server-management-key'));
});

test('managed desktop key refuses a missing spend ceiling', async () => {
  process.env.OPENROUTER_MANAGEMENT_API_KEY = 'server-management-key';
  await assert.rejects(
    createProvisionedKey('chotu_user', '0', '2026-08-13T00:00:00.000Z'),
    /Invalid OPENROUTER_CREDIT_LIMIT_USD/,
  );
});
