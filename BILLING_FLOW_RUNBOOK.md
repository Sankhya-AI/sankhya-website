# Chotu billing flow — runbook (paid + BYOK + managed credits + top-up)

End-to-end: user → Sankhya site → buys plan (or picks BYOK) → downloads → signs into
Chotu desktop → app uses the account's own OpenRouter credits → sees usage → tops up.

## Architecture (who owns what)

- **Razorpay** owns payment collection (₹1999/mo plan + top-up links). Source of truth for money.
- **Firebase Auth** owns identity (Google). **Firestore** stores entitlement + key metadata only.
  Secrets live in `users/{uid}/secrets/openrouter` (server-read only; `firestore.rules` denies clients).
- **OpenRouter** issues a **per-user provisioned key** with a monthly USD limit (our account funds it).
- **Chotu desktop** authenticates by a **signed entitlement** (not Firebase). The per-user key is
  cryptographically bound into a signed, one-minute, one-use loopback token and stored in macOS
  Keychain or Windows DPAPI. The browser submits the token to Chotu's fixed loopback callback in
  a POST body, never in a query string. It is hydrated only into Chotu process memory.

## Plans

| Plan | Price | Managed credits | Key |
|------|-------|-----------------|-----|
| **Chotu Managed** | ₹1999 / month (recurring) | $12 / month, resets monthly | provisioned for the user |
| **Bring your own key (BYOK)** | Free | none | user pastes their own in Settings |

Top-up packs (stack onto the current month's limit): ₹499→$3, ₹999→$6, ₹1999→$12.

## Required environment (Vercel project + local `.env.local`)

```
# Firebase admin (server)
FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

# Razorpay
RAZORPAY_KEY_ID            # test: rzp_test_...   (used by sync-subscription)
RAZORPAY_KEY_SECRET        # test secret          (used by sync-subscription)
RAZORPAY_WEBHOOK_SECRET    # webhook signing secret

# OpenRouter (our provisioning account)
OPENROUTER_MANAGEMENT_API_KEY  # management-only key; creates/patches/disables scoped per-user keys
OPENROUTER_CREDIT_LIMIT_USD=12 # monthly base grant per user

# Desktop license signing
CHOTU_LICENSE_PRIVATE_KEY_PEM  # ed25519 private key (PEM)

# Download gate
DOWNLOAD_TOKEN_SECRET, GITHUB_RELEASE_TOKEN, GITHUB_RELEASE_ASSET_* …

# Cron
CRON_SECRET

# Web search/read proxy (server-held provider keys; desktop authenticates with
# its signed entitlement — see "Web proxy" section)
JINA_API_KEYS                  # one or more Jina keys, comma-separated; each is a failover rung
FIRECRAWL_API_KEY              # Firecrawl v2 search fallback (optional until provisioned)
SCRAPE_DO_TOKEN                # scrape.do markdown-read fallback (optional)
# optional overrides: CHOTU_WEB_SEARCH_DAILY_LIMIT (default 400), CHOTU_WEB_READ_DAILY_LIMIT (default 800)

# Frontend top-up links (Vite, build-time; code defaults are listed below)
VITE_RAZORPAY_TOPUP_LINK_3USD   # ₹499  -> $3 credits
VITE_RAZORPAY_TOPUP_LINK_6USD   # ₹999  -> $6 credits
VITE_RAZORPAY_TOPUP_LINK_12USD  # ₹1999 -> $12 credits
# optional: VITE_RAZORPAY_PAYMENT_LINK_URL (plan checkout override)
```

## Razorpay dashboard setup

1. **Plan payment link** (₹1999) → already `https://rzp.io/rzp/eEubzej` (or override via env).
   - Plan id: `plan_T2lcsEWrwxmhVV`
   - Current dashboard subscription id: `sub_T2lddyk86lYMEV`
   - Do not hardcode one subscription id for all users; store the actual subscription id received
     from Razorpay webhooks/sync on each user's `subscriptions/chotu` document.
2. **Three top-up payment links**:
   - ₹499 → $3 credits: `https://rzp.io/rzp/MrUioHC`
   - ₹999 → $6 credits: `https://rzp.io/rzp/f1e43wc0`
   - ₹1999 → $12 credits: `https://rzp.io/rzp/tMc5XGg`

   On each link set **Notes**: `kind=topup` and `topup_usd=3|6|12`. The webhook
   reads these notes. Static `rzp.io` links match the signed-in account by Razorpay
   customer email, so test with the same email as the Sankhya account.
   Configure each link's post-payment redirect back to `/account?razorpay_payment_id=...`
   so the account page can recover a missed webhook from the captured payment id.
3. **Webhook** → `https://<site>/api/razorpay-webhook`, signed with `RAZORPAY_WEBHOOK_SECRET`.
   Enable events: `payment.captured`, `payment_link.paid`, `subscription.authenticated`,
   `subscription.charged`, `payment.failed`, `subscription.cancelled`, `subscription.halted`,
   `subscription.completed`.
4. Deploy Firestore rules/indexes: `firebase deploy --only firestore`. The top-up
   limit-sync query uses Firestore's automatic single-field index; no extra composite
   index is required for `managedApiKey.limitSyncPending`.

## Endpoints added / changed

- `POST /api/select-plan` — self-select the free BYOK plan (Firebase-authed; refuses paid).
- `POST /api/sync-subscription` — reconcile entitlement and top-ups from Razorpay (recovers a
  dropped webhook; pass `{ paymentId }` from the post-checkout redirect). Only ever grants verified
  access/credits for captured payments belonging to the signed-in user.
- `api/razorpay-webhook.js` — event-id idempotency; `kind=topup` raises the key limit immediately
  (cron is the OpenRouter PATCH fallback); top-up payment ids are idempotent across webhook and
  redirect recovery; activation/renewal resets the limit to the monthly base.
- `api/cron-managed-keys.js` — new flag-driven limit-sync pass converges OpenRouter limits.
- `api/create-desktop-login-token.js` — embeds the per-user key for active managed accounts and
  returns it separately from the exact fixed callback URL for POST delivery.
- Desktop hub `auth_browser_callback` — verifies the signed v2 envelope, consumes its nonce once,
  and persists the delivered scoped key in platform secure storage.

## Web proxy (search + read for every install, no user key needed)

- `POST /api/web-search` — `{query, limit}` → `{provider, results: [{title, url, snippet}]}`.
  Provider order: each `JINA_API_KEYS` entry in turn (s.jina.ai) → `FIRECRAWL_API_KEY` (v2 search).
- `POST /api/web-read` — `{url}` → `{provider, url, content, truncated}` (markdown).
  Provider order: each Jina key against r.jina.ai → `SCRAPE_DO_TOKEN` (scrape.do markdown).
- **Auth**: `Authorization: Bearer <base64url(signed entitlement)>`. The desktop replays the
  entitlement persisted at sign-in (`license.json`); the server verifies its own Ed25519
  signature (`CHOTU_LICENSE_PRIVATE_KEY_PEM`) plus `status` ∈ {trialing, active} and the
  `updates_until` window. No new secret is ever provisioned for search.
- **Budget**: per-license daily counters in Firestore `webProxyUsage/{licenseId}_{YYYY-MM-DD}`;
  429 with `code=budget_exhausted` when over. Defaults 400 searches / 800 reads per day.
- **Key rotation**: change the Vercel env (`JINA_API_KEYS` is comma-separated, order = priority)
  and redeploy — no desktop update needed. Client-side, an owner-pasted
  `CHOTU_JINA_API_KEY`/`CHOTU_FIRECRAWL_API_KEY` always wins before the proxy is tried.

## End-to-end test (Razorpay TEST mode — no real money)

Run the site API with `vercel dev` (loads `.env.local`), the SPA with `npm run dev`, and the hub
locally (port 7777). Use a Razorpay test card.

1. **Buy managed**: sign in (Google) → Account → *Subscribe with Razorpay* → pay (test card).
   - Webhook fires → `subscriptions/chotu` becomes `status:active`, `access.managedKeys:true`,
     `managedApiKey.status:pending` → on-demand/cron provisions an OpenRouter key ($12 limit).
   - Confirm `users/{uid}/secrets/openrouter.apiKey` exists and `managedApiKey.status:active`.
2. **Download**: *Download Mac M-series* returns a one-use link (gate verifies entitlement).
3. **Desktop sign-in**: in Chotu, start sign-in → browser callback returns. Confirm no managed
   key is written to Dhee's env file, the platform secret-store entry exists, and Settings →
   **Model & usage** reports `sankhya_account_managed` without returning secret material.
4. **Use it**: send a chat turn through the account-managed OpenRouter route and watch usage tick up.
5. **Top up**: Settings → *Top up credits* (or Account → top-up pack). Pay ₹499 test →
   webhook adds $3 → limit becomes $15 (verify in Settings, and on the OpenRouter key).
   - Reliability check: temporarily set `managedApiKey.creditLimitUsd` ahead of the live limit,
     run `GET /api/cron-managed-keys` (Bearer `CRON_SECRET`), confirm the limit converges.
6. **BYOK**: second account → Account → *Use the free plan* → `plan:byok`, no managed key.
   Download + desktop sign-in still work; in Settings paste your own OpenRouter/provider key.
7. **Dropped-webhook recovery**: disable the webhook, pay, land back on `/account?razorpay_payment_id=…`
   → AccountPage calls `sync-subscription` → access is granted from the verified plan payment, or
   a top-up is applied once from the verified top-up payment.

## Automated tests

- Website: `npm test` (pure logic — license token wrapper, entitlement windows, activation patch).
- Hub: `uv run pytest tests/test_managed_key_signin.py -q` (signed-token integrity, replay,
  secure persistence, and credential gating) plus focused auth/provider-key route tests.
