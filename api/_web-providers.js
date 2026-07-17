import crypto from 'node:crypto';
import { desktopLicensePublicKeyPem, stableStringify } from './_desktop-license.js';
import { admin, getAdminDb } from './_firebase-admin.js';

const ENTITLEMENT_SCHEMA = 'chotu.entitlement.v1';
const ACTIVE_STATUSES = new Set(['trialing', 'active']);
const MAX_QUERY_CHARS = 400;
const MAX_URL_CHARS = 2000;
const MAX_READ_CHARS = 100_000;
const MAX_RESULTS = 10;

function httpError(statusCode, message, code = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
}

// The desktop presents its persisted signed entitlement (base64url JSON) as the
// bearer credential. We verify our own Ed25519 signature, so search access
// needs no new secret — signing in to Chotu is the provisioning step.
export function verifyEntitlementBearer(authorizationHeader, { now = Date.now, publicKeyPem = null } = {}) {
  const header = String(authorizationHeader || '');
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : '';
  if (!token) throw httpError(401, 'Chotu sign-in required');

  let entitlement;
  try {
    entitlement = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
  } catch {
    throw httpError(401, 'Invalid Chotu credential');
  }
  if (!entitlement || typeof entitlement !== 'object' || entitlement.schema_version !== ENTITLEMENT_SCHEMA) {
    throw httpError(401, 'Invalid Chotu credential');
  }
  if (entitlement.product_id !== 'chotu' || !ACTIVE_STATUSES.has(entitlement.status)) {
    throw httpError(403, 'Active Chotu plan or launch trial required');
  }

  const signature = String(entitlement.signature || '');
  if (!signature.startsWith('ed25519:')) throw httpError(401, 'Invalid Chotu credential');
  const payload = { ...entitlement };
  delete payload.signature;
  const publicKey = crypto.createPublicKey(publicKeyPem || desktopLicensePublicKeyPem());
  const verified = crypto.verify(
    null,
    Buffer.from(stableStringify(payload), 'utf8'),
    publicKey,
    Buffer.from(signature.slice('ed25519:'.length), 'base64url'),
  );
  if (!verified) throw httpError(401, 'Invalid Chotu credential');

  const accessUntil = Date.parse(entitlement.updates_until || entitlement.trial_ends_at || '');
  if (!Number.isFinite(accessUntil) || accessUntil <= now()) {
    throw httpError(403, 'Chotu plan window has ended. Sign in again from your account page.');
  }

  return {
    licenseId: String(entitlement.license_id || ''),
    userId: String(entitlement.user_id || ''),
    status: String(entitlement.status),
  };
}

// One Firestore transaction per request keeps the daily budget honest across
// concurrent function instances without any shared in-memory state.
export async function consumeDailyBudget(licenseId, kind, limit) {
  if (!licenseId) throw httpError(401, 'Invalid Chotu credential');
  const day = new Date().toISOString().slice(0, 10);
  const db = getAdminDb();
  const ref = db.collection('webProxyUsage').doc(`${licenseId}_${day}`);
  await db.runTransaction(async (t) => {
    const snapshot = await t.get(ref);
    const used = Number(snapshot.data()?.[kind] || 0);
    if (used >= limit) {
      throw httpError(429, `Daily ${kind} budget reached. It resets at midnight UTC.`, 'budget_exhausted');
    }
    t.set(
      ref,
      { [kind]: used + 1, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );
  });
}

function normalizedHit(title, url, snippet) {
  const cleanUrl = String(url || '').trim();
  if (!cleanUrl) return null;
  return {
    title: String(title || cleanUrl).trim(),
    url: cleanUrl,
    snippet: String(snippet || '').trim().slice(0, 500),
  };
}

async function jinaSearch(query, limit, apiKey, fetchImpl) {
  const response = await fetchImpl(`https://s.jina.ai/?q=${encodeURIComponent(query)}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-Respond-With': 'no-content',
    },
  });
  if (!response.ok) throw httpError(502, `jina_http_${response.status}`);
  const payload = await response.json();
  const rows = Array.isArray(payload?.data) ? payload.data : null;
  if (!rows) throw httpError(502, 'jina_missing_data');
  return rows
    .map((row) => normalizedHit(row?.title, row?.url, row?.description ?? row?.content))
    .filter(Boolean)
    .slice(0, limit);
}

async function firecrawlSearch(query, limit, apiKey, fetchImpl) {
  const response = await fetchImpl('https://api.firecrawl.dev/v2/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, limit, sources: ['web'] }),
  });
  if (!response.ok) throw httpError(502, `firecrawl_http_${response.status}`);
  const payload = await response.json();
  const rows = Array.isArray(payload?.data?.web) ? payload.data.web : null;
  if (!rows) throw httpError(502, 'firecrawl_missing_web_results');
  return rows
    .map((row) => normalizedHit(row?.title, row?.url, row?.description ?? row?.snippet))
    .filter(Boolean)
    .slice(0, limit);
}

// JINA_API_KEYS holds one or more comma-separated keys; every key is its own
// failover rung so a rate-limited or exhausted key hands off to the next.
export function jinaApiKeys(env) {
  const merged = [env.JINA_API_KEYS, env.JINA_API_KEY].filter(Boolean).join(',');
  return [...new Set(merged.split(/[\s,]+/).map((key) => key.trim()).filter(Boolean))];
}

function jinaProviderLabel(index) {
  return index === 0 ? 'jina' : `jina_${index + 1}`;
}

export async function searchWithProviders(rawQuery, rawLimit, { fetchImpl = fetch, env = process.env } = {}) {
  const query = String(rawQuery || '').trim().slice(0, MAX_QUERY_CHARS);
  if (!query) throw httpError(400, 'query is required');
  const limit = Math.max(1, Math.min(Number(rawLimit) || 5, MAX_RESULTS));

  const providers = jinaApiKeys(env).map((key, index) => [
    jinaProviderLabel(index),
    () => jinaSearch(query, limit, key, fetchImpl),
  ]);
  if (env.FIRECRAWL_API_KEY?.trim()) {
    providers.push(['firecrawl', () => firecrawlSearch(query, limit, env.FIRECRAWL_API_KEY.trim(), fetchImpl)]);
  }
  if (!providers.length) throw httpError(503, 'No search provider is configured', 'no_provider_configured');

  const attempts = [];
  for (const [provider, run] of providers) {
    try {
      return { provider, results: await run() };
    } catch (error) {
      attempts.push(`${provider}:${error.message}`);
    }
  }
  throw httpError(502, `Search providers unavailable (${attempts.join(', ')})`, 'search_unavailable');
}

async function jinaRead(url, apiKey, fetchImpl) {
  const headers = { Accept: 'text/plain' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const response = await fetchImpl(`https://r.jina.ai/${url}`, { headers });
  if (!response.ok) throw httpError(502, `jina_reader_http_${response.status}`);
  return response.text();
}

async function scrapeDoRead(url, token, fetchImpl) {
  const endpoint = `https://api.scrape.do/?token=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}&output=markdown`;
  const response = await fetchImpl(endpoint);
  if (!response.ok) throw httpError(502, `scrape_do_http_${response.status}`);
  return response.text();
}

export async function readWithProviders(rawUrl, { fetchImpl = fetch, env = process.env } = {}) {
  const url = String(rawUrl || '').trim().slice(0, MAX_URL_CHARS);
  if (!/^https?:\/\//i.test(url)) throw httpError(400, 'A public http(s) URL is required');

  const keys = jinaApiKeys(env);
  const providers = keys.length
    ? keys.map((key, index) => [`${jinaProviderLabel(index)}_reader`, () => jinaRead(url, key, fetchImpl)])
    : [['jina_reader_anonymous', () => jinaRead(url, '', fetchImpl)]];
  if (env.SCRAPE_DO_TOKEN?.trim()) {
    providers.push(['scrape_do', () => scrapeDoRead(url, env.SCRAPE_DO_TOKEN.trim(), fetchImpl)]);
  }

  const attempts = [];
  for (const [provider, run] of providers) {
    try {
      const content = String(await run());
      return {
        provider,
        url,
        content: content.slice(0, MAX_READ_CHARS),
        truncated: content.length > MAX_READ_CHARS,
      };
    } catch (error) {
      attempts.push(`${provider}:${error.message}`);
    }
  }
  throw httpError(502, `Read providers unavailable (${attempts.join(', ')})`, 'read_unavailable');
}

export function dailyLimit(env, name, fallback) {
  const value = Number(env[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}
