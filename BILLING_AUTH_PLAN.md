# Chotu Auth, Subscription, and Usage Architecture

> Historical planning note. The current implemented billing/top-up flow is in
> `BILLING_FLOW_RUNBOOK.md`; follow that runbook for Razorpay links, webhooks,
> BYOK, managed credits, and desktop key delivery.

## Recommendation

Start with Firebase Auth plus a small server-owned entitlement record. Do not integrate Lago Cloud until there are real paid customers or usage-based invoices to reconcile. Lago's docs currently position open source as forever-free, while premium cloud/self-hosted plans do not offer free trials, so it should remain an adapter behind your backend rather than a frontend dependency.

Chotu pricing:
- Launch month: first month free.
- After month 1: Rs 1999 through Razorpay, about $20 for outside-India customers after card conversion.
- India customers can pay with UPI through Razorpay checkout; outside-India customers use cards through the same Razorpay link.
- Razorpay remains the only launch payment provider. Do not add Dodo, Paddle, Lemon Squeezy, or Stripe until there is a deliberate migration plan.
- The desktop license and Sankhya API-key billing should be separate products.
- The local desktop app remains usable after download, but updates, support, managed keys, and chotu_api require an active plan.
- The dashboard should store account and entitlement metadata only. Razorpay should own payment collection, invoices, refunds, and recurring billing primitives.
- Private GitHub Releases are the source of truth for binaries, but customers download through `app.chotu.ai` so GitHub credentials stay server-side.

## Strategy 1: Zero-spend bootstrap

Stack:
- Firebase Auth for Google and email/password login.
- Firestore user record: `users/{firebaseUid}/subscriptions/chotu`.
- Razorpay subscription link for launch-month-free Chotu access.
- A tiny server webhook later creates or updates the Chotu subscription after payment succeeds.
- Chotu desktop app reads subscription and usage through your backend using the Firebase ID token.

Benefits:
- Lowest cost and fastest launch.
- Simple to maintain while customer count is low.
- Keeps subscription authority server-side instead of trusting the browser.
- Users can sign in to a hosted Sankhya dashboard immediately, even before billing automation is complete.

Drawbacks:
- Manual operations until webhook automation exists.
- No full invoice, dunning, wallet, credit-balance, or tax workflow.
- Usage charges need a small custom meter.
- Cancel-card-update flows cannot be self-service until Razorpay backend endpoints are added.

Best fit:
- Pre-customer and first-customer phase.

## Razorpay MVP setup

Use a Razorpay Payment Link first. It is cheaper and faster than a custom payment gateway integration, and it keeps Razorpay secrets out of the Vite frontend.

Frontend-only launch:
- Use `https://rzp.io/rzp/eEubzej` as the default Razorpay subscription link.
- Optionally override with `VITE_RAZORPAY_PAYMENT_LINK_URL` in `.env.local`.
- Keep checkout in INR for now. If Razorpay International Payments is enabled, outside-India customers can pay by card and their card issuer converts the Rs 1999 charge.
- After payment, manually mark the matching Firestore entitlement active until webhooks are added.

Automated launch:
- Use the Vercel endpoint `/api/razorpay-webhook` for Razorpay webhook events.
- Store Vercel secrets: `RAZORPAY_WEBHOOK_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
- Store download-gate secrets: `DOWNLOAD_TOKEN_SECRET`, `GITHUB_RELEASE_TOKEN`, and per-artifact asset ids such as `GITHUB_RELEASE_ASSET_CHOTU_DARWIN_ARM64`.
- Store the Firebase UID in `reference_id` or `notes`.
- Configure Razorpay webhooks for paid payment links.
- Verify the webhook signature server-side before updating Firestore entitlements.
- Add dashboard actions that call backend endpoints for subscription cancellation, invoice fetches, and payment-method updates.

## Sankhya account dashboard

Build the hosted dashboard at `/account` on the Sankhya site first. Keep the surface intentionally small:

- Google login through Firebase Auth.
- Personal details: name and email. Do not show Firebase UID in the customer dashboard.
- Chotu subscription: status, launch-month-free offer, Rs 1999 Razorpay pricing, update window.
- Sankhya API-key plan: status, usage spend, renewal date, Razorpay subscription reference if present.
- Billing actions: update card, cancel API plan, view invoices.

Do not store raw card data, card numbers, CVV, or card expiry in Firestore. Store only stable references such as Razorpay customer id, subscription id, payment link id, invoice id, status, and last synced timestamps. Sensitive billing actions should redirect to Razorpay-hosted flows or call backend endpoints that use Razorpay APIs with server-side secrets.

API key billing model:
- First phase: prepaid or flat monthly API-key subscription through Razorpay Subscriptions.
- Usage mirror: aggregate request/token/spend totals in Firestore for display.
- Enforcement: the API gateway checks Firebase identity plus active API-key entitlement before serving Sankhya-issued keys.
- Later phase: move usage rating to Lago/OpenMeter/custom ledger when true metered billing becomes necessary.

Razorpay CLI:
- Razorpay has an official CLI for terminal API testing and workflow automation.
- Install on macOS/Linux with `curl -fsSL https://razorpay.com/cli/latest/install.sh | bash`.
- Configure test credentials with `razorpay configure --key-id rzp_test_xxxxxxxxxxxx --key-secret xxxxxxxxxxxxxxxxxxxx`.
- Do not put Razorpay key secrets in Vite env vars; only backend code or local CLI config should use them.

## Strategy 2: Firebase identity plus Lago adapter

Stack:
- Firebase Auth remains the source of user identity.
- Your backend creates Lago customers and subscriptions after payment confirmation.
- API gateway reports metered usage events to Lago and stores a summarized usage mirror for Chotu.
- Chotu desktop app displays the summary from your backend or Firestore.

Benefits:
- Better for pay-as-you-go API keys.
- Lago can model usage-based billing, subscriptions, credits, and invoices.
- You avoid rewriting billing logic later.

Drawbacks:
- Cloud may cost money or require sales contact; self-hosting costs ops time.
- More moving parts before revenue validates the need.
- Requires careful idempotency between payment webhooks, Firebase users, Lago customers, and usage events.

Best fit:
- After customers begin using Sankhya-issued API keys enough that manual usage billing is painful.

## Strategy 3: Full billing backend first

Stack:
- Firebase Auth.
- Stripe or equivalent payment processor.
- Backend service owns checkout sessions, webhooks, subscription states, API-key issuance, usage aggregation, and customer portal links.
- Optional Lago, OpenMeter, or custom ledger behind the backend.

Benefits:
- Strongest reliability, auditability, and payment correctness.
- Clean path for refunds, tax, invoices, failed payments, and enterprise contracts.
- Easier to support multiple products later.

Drawbacks:
- Highest upfront implementation cost.
- Slower launch.
- Overbuilt before proving demand.

Best fit:
- When Chotu has enough paying users that billing correctness becomes a business risk.

## Backend contract

The frontend can authenticate users and pass identity into checkout, but these actions must be server-side:

- Confirm payment completion.
- Create the Chotu subscription entitlement.
- Issue Sankhya API keys.
- Record usage events.
- Rate usage into customer-visible totals.
- Protect subscription reads with Firebase ID token verification.
- Keep signing secrets, webhook secrets, service-account keys, and update-channel secrets out of browser-readable Firestore documents. Use Vercel environment variables or Firebase/Google Secret Manager. Firestore stores only entitlement flags and server-written metadata.

Download gate:
- Private GitHub Release: `Sankhya-AI/ChotuAI`.
- Internal/dev download can use `gh release download`.
- Paid user command should use the app domain:

```bash
curl -L https://app.chotu.ai/downloads/chotu-darwin-arm64.zip -o chotu.zip
```

- `/api/create-download-token` verifies the Firebase ID token and Firestore entitlement, then returns a short-lived download URL.
- `/downloads/:artifact` validates the short-lived token and proxies the GitHub release asset with `GITHUB_RELEASE_TOKEN` server-side.
- Expired users keep their local app, but cannot fetch new release artifacts, managed keys, or chotu_api.

Minimal Firestore entitlement shape:

```json
{
  "status": "active",
  "plan": "chotu",
  "entitlement": "Chotu BYOK license, 1 year of updates",
  "updateUntil": "2027-05-21",
  "access": {
    "localApp": true,
    "updates": true,
    "support": true,
    "managedKeys": true,
    "chotuApi": true
  },
  "billingMode": "razorpay",
  "razorpayCustomerId": "cust_xxx",
  "razorpaySubscriptionId": null,
  "currentPeriodEnd": null,
  "usage": {
    "apiSpendUsd": 0,
    "requests": 0,
    "tokens": 0
  }
}
```
