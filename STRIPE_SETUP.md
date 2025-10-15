# Stripe Integration Setup Guide

This guide will help you set up the Stripe payment integration for Movienta's subscription and credit system.

## Overview

The system supports:

- **Monthly Subscription**: Recurring billing with automatic credit grants
- **Credit Top-ups**: One-time purchases for additional credits
- **Webhook Integration**: Automatic credit provisioning via Firebase Functions

## Prerequisites

1. Active Stripe account
2. Firebase project with Functions enabled
3. Node.js 18+ installed locally

---

## 1. Stripe Product Configuration

### Step 1: Configure Stripe Products

Your products are already created:

- **Movienta Subscription**: `prod_TEaEffY60JvnBc`
- **Movienta Credit Top Up**: `prod_TEm6R171wTtl3A`

### Step 2: Configure Price Metadata

You **MUST** add metadata to your Stripe prices for the system to work:

#### For Subscription Price (`price_1SI73dHEYmBmUXRrgSZHNK8D`):

1. Go to Stripe Dashboard → Products → Movienta Subscription
2. Click on the price `price_1SI73dHEYmBmUXRrgSZHNK8D`
3. Click "Add metadata"
4. Add: `monthlyCredits` = `500` (or your desired amount)
5. Save

#### For Top-up Price (`price_1SIIXyHEYmBmUXRrd6qPYKoJ`):

1. Go to Stripe Dashboard → Products → Movienta Credit Top Up
2. Click on the price `price_1SIIXyHEYmBmUXRrd6qPYKoJ`
3. Click "Add metadata"
4. Add: `credits` = `100` (or your desired amount)
5. Save

---

## 2. Install Dependencies

### Next.js App Dependencies

```bash
cd movienta
npm install stripe firebase-admin
```

### Firebase Functions Dependencies

```bash
cd movienta/functions
npm install stripe
```

---

## 3. Environment Variables

### Local Development (.env.local)

Create `.env.local` in the `movienta` directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then fill in your values:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Product/Price IDs
STRIPE_PRODUCT_SUBSCRIPTION=prod_TEaEffY60JvnBc
STRIPE_PRODUCT_TOPUP=prod_TEm6R171wTtl3A
STRIPE_PRICE_SUBSCRIPTION=price_1SI73dHEYmBmUXRrgSZHNK8D
STRIPE_PRICE_TOPUP=price_1SIIXyHEYmBmUXRrd6qPYKoJ

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Admin (for local)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### Production (Vercel)

Add the same environment variables in Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable
3. Redeploy

---

## 4. Deploy Firebase Functions

### Step 1: Set Firebase Secrets

```bash
# Navigate to functions directory
cd movienta/functions

# Set Stripe secret key
firebase functions:secrets:set STRIPE_SECRET_KEY
# When prompted, paste your Stripe secret key

# Set webhook secret (you'll get this after creating the webhook endpoint)
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

### Step 2: Update functions/package.json

The `stripe` dependency should already be added. If not, add it manually:

```json
{
  "dependencies": {
    "firebase-admin": "^12.6.0",
    "firebase-functions": "^6.0.1",
    "stripe": "^17.5.0"
  }
}
```

### Step 3: Deploy Functions

```bash
# From the functions directory
npm run build
firebase deploy --only functions
```

After deployment, note the webhook URL:

```
https://us-central1-<YOUR_PROJECT_ID>.cloudfunctions.net/stripeWebhook
```

---

## 5. Configure Stripe Webhook

### Step 1: Create Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter the webhook URL from above
4. Select these events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click "Add endpoint"

### Step 2: Get Signing Secret

1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_...`)
3. Set it in Firebase Functions:

```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
# Paste the signing secret when prompted
```

### Step 3: Redeploy Functions

```bash
firebase deploy --only functions:stripeWebhook
```

---

## 6. Update Firestore Rules

Deploy the updated Firestore rules:

```bash
firebase deploy --only firestore:rules
```

The rules should include:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;

      match /credits_ledger/{id} {
        allow read, write: if false;
      }
    }
  }
}
```

---

## 7. Testing

### Test Subscription Flow

1. Start your Next.js app:

   ```bash
   npm run dev
   ```

2. Sign in to your app
3. Navigate to `/admin` - you should see the paywall
4. Click "Subscribe Now"
5. Use Stripe test card: `4242 4242 4242 4242`

   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

6. Complete checkout
7. Check Firestore to verify:
   - User document has `billing.stripe.customerId`
   - User document has `billing.stripe.subscriptionId`
   - User document has `credits.current = 500` (or your configured amount)
   - Credits ledger entry exists

### Test Credit Top-up

1. From the credits page (`/credits`)
2. Click "Buy Credits"
3. Complete checkout with test card
4. Verify credits are added to user's balance

### Test Webhook Locally (Optional)

Use Stripe CLI for local webhook testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your function
stripe listen --forward-to https://us-central1-<YOUR_PROJECT>.cloudfunctions.net/stripeWebhook

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

---

## 8. Monitoring

### Check Webhook Deliveries

1. Stripe Dashboard → Developers → Webhooks
2. Click on your endpoint
3. View recent attempts and responses

### Check Firebase Logs

```bash
firebase functions:log --only stripeWebhook
```

Or view in Firebase Console → Functions → Logs

### Check Firestore Data

1. Firebase Console → Firestore Database
2. Navigate to `users/{uid}`
3. Verify:
   - `billing` object
   - `credits` object
   - `credits_ledger` subcollection

---

## 9. Credit Consumption

To consume credits in your API routes, use the helper function:

```typescript
import { consumeCreditOrThrow } from "@/lib/stripe";

// In your API route handler
try {
  await consumeCreditOrThrow(userId, optionalLandingPageId);
  // Continue with API logic
} catch (error) {
  if (error.message === "NO_CREDITS") {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 402 }
    );
  }
  throw error;
}
```

---

## 10. Production Checklist

- [ ] Replace test Stripe keys with live keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Set all environment variables in Vercel
- [ ] Create production webhook endpoint in Stripe
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Firebase Functions
- [ ] Deploy all Firebase resources (rules, functions)
- [ ] Test full payment flow in production
- [ ] Monitor webhook deliveries
- [ ] Set up error alerting (Sentry, etc.)

---

## Troubleshooting

### Credits Not Appearing After Payment

1. Check webhook delivery in Stripe Dashboard
2. Check Firebase Functions logs for errors
3. Verify price metadata is set correctly
4. Ensure webhook signing secret is correct

### Webhook Signature Verification Failing

1. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
2. Ensure you're using the correct endpoint URL
3. Check that the webhook is sending to the deployed function (not localhost)

### User Not Found After Subscription

1. Verify customer metadata includes `firebaseUid`
2. Check that the customer ID is saved in Firestore
3. Review Firebase Functions logs for errors

---

## Support

For issues or questions:

1. Check Firebase Functions logs
2. Check Stripe webhook delivery logs
3. Review Firestore data structure
4. Contact support with error messages and context

---

## Next Steps

After setup is complete:

1. Customize the pricing tiers in the UI components
2. Add more subscription tiers if needed
3. Implement credit consumption in your API routes
4. Set up monitoring and alerting
5. Consider adding a usage dashboard
