import { requireEnv } from './_firebase-admin.js';

const BASE_URL = 'https://openrouter.ai/api/v1';

function authHeaders() {
  return {
    Authorization: `Bearer ${requireEnv('OPENROUTER_API_KEY')}`,
    'Content-Type': 'application/json',
  };
}

export async function createProvisionedKey(name, limitUsd) {
  const limit = parseFloat(limitUsd);
  if (!Number.isFinite(limit)) throw new Error(`Invalid OPENROUTER_CREDIT_LIMIT_USD: ${limitUsd}`);

  const res = await fetch(`${BASE_URL}/keys`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, limit, limit_reset: 'monthly' }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter createKey failed ${res.status}: ${text}`);
  }

  const body = await res.json();
  const key = body.key;
  const hash = body.data?.hash;
  if (!key || !hash) throw new Error('OpenRouter response missing key or hash');
  return { key, hash };
}

export async function updateKeyLimit(hash, limitUsd) {
  const limit = parseFloat(limitUsd);
  if (!Number.isFinite(limit) || limit < 0) throw new Error(`Invalid key limit: ${limitUsd}`);

  const res = await fetch(`${BASE_URL}/keys/${encodeURIComponent(hash)}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ limit }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter updateKeyLimit failed ${res.status}: ${text}`);
  }

  return { ok: true, limit };
}

export async function disableKey(hash) {
  const res = await fetch(`${BASE_URL}/keys/${encodeURIComponent(hash)}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ disabled: true }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter disableKey failed ${res.status}: ${text}`);
  }

  return { ok: true };
}
