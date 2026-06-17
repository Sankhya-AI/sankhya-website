# Chotu billing flow — runbook (paid + BYOK + managed credits + top-up)

End-to-end: user → Sankhya site → buys plan (or picks BYOK) → downloads → signs into
Chotu desktop → app uses the account's own OpenRouter credits → sees usage → tops up.

## Architecture (who owns what)

- **Razorpay** owns payment collection (₹1999/mo plan + top-up links). Source of truth for money.
- **Firebase Auth** owns identity (Google). **Firestore** stores entitlement + key metadata only.
  Secrets live in `users/{uid}/secrets/openrouter` (server-read only; `firestore.rules` denies clients).
- **OpenRouter** issues a **per-user provisioned key** with a monthly USD limit (our account funds it).
- **Chotu desktop** authenticates by a **signed entitlement** (not Firebase). The per-user key is
  delivered inside the loopback sign-in token and stored as `CHOTU_KEY_API_KEY`.

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
OPENROUTER_API_KEY             # provisioning key (creates/patches/disables per-user keys)
OPENROUTER_CREDIT_LIMIT_USD=12 # monthly base grant per user

# Desktop license signing
CHOTU_LICENSE_PRIVATE_KEY_PEM  # ed25519 private key (PEM)

# Download gate
DOWNLOAD_TOKEN_SECRET, GITHUB_RELEASE_TOKEN, GITHUB_RELEASE_ASSET_* …

# Cron
CRON_SECRET

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
- `api/create-desktop-login-token.js` — embeds the per-user key for active managed accounts.
- Desktop hub `auth_browser_callback` — persists the delivered key as `CHOTU_KEY_API_KEY`.

## End-to-end test (Razorpay TEST mode — no real money)

Run the site API with `vercel dev` (loads `.env.local`), the SPA with `npm run dev`, and the hub
locally (port 7777). Use a Razorpay test card.

1. **Buy managed**: sign in (Google) → Account → *Subscribe with Razorpay* → pay (test card).
   - Webhook fires → `subscriptions/chotu` becomes `status:active`, `access.managedKeys:true`,
     `managedApiKey.status:pending` → on-demand/cron provisions an OpenRouter key ($12 limit).
   - Confirm `users/{uid}/secrets/openrouter.apiKey` exists and `managedApiKey.status:active`.
2. **Download**: *Download Mac M-series* returns a one-use link (gate verifies entitlement).
3. **Desktop sign-in**: in Chotu, start sign-in → browser callback returns. Confirm the hub's
   `dhee_env_file` now has `CHOTU_KEY_API_KEY=` (the per-user key), and Settings → **Model & usage**
   shows "$X of $12 used" pulled live from OpenRouter `/key`.
4. **Use it**: pick **Chotu Key**, send a chat turn, watch usage tick up.
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
- Hub: `.venv/bin/python -m pytest tests/test_managed_key_signin.py -q` (token parse, persistence
  gating, env writer) and the existing `tests/test_hub_api.py` auth/provider-key suites.
