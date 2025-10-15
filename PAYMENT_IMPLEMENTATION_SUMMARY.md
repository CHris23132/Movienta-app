# Payment System Implementation Summary

## Overview

A complete Stripe-based payment system has been implemented for Movienta with:

- Monthly subscription billing
- One-time credit top-ups
- Automatic credit provisioning via webhooks
- Paywall protection for admin features
- Credits management dashboard

---

## What Was Implemented

### 1. Firestore Database Schema

**Updated:** `firestore.rules`

User document structure:

```
users/{uid}
  ├── billing
  │   └── stripe
  │       ├── customerId: string
  │       └── subscriptionId?: string
  ├── credits
  │   ├── current: number
  │   └── lastUpdatedAt: Timestamp
  └── credits_ledger/{entryId}
      ├── type: "grant" | "debit" | "rollback"
      ├── amount: number
      ├── reason: string
      ├── stripeEventId?: string
      └── createdAt: Timestamp
```

Security rules ensure:

- Users can only read their own data
- Only server (Firebase Functions) can write credits
- Credits ledger is completely server-only

---

### 2. Backend Infrastructure

#### Server Utilities (`src/lib/stripe.ts`)

- Stripe client initialization
- Customer creation/retrieval
- Active subscription checking
- Credit balance queries

#### API Routes

**`src/app/api/checkout/monthly/route.ts`**

- Creates Stripe Checkout session for subscriptions
- Validates user authentication
- Links customer to Firebase user

**`src/app/api/checkout/topup/route.ts`**

- Creates Stripe Checkout session for one-time purchases
- Handles credit top-up payments

**`src/app/api/credits/summary/route.ts`**

- Returns user's credit balance
- Subscription status check
- Used by frontend components

---

### 3. Firebase Cloud Functions

#### Webhook Handler (`functions/src/index.ts`)

Processes Stripe events:

- **`checkout.session.completed`**: Grants credits for one-time purchases
- **`invoice.payment_succeeded`**: Grants monthly subscription credits
- **`customer.subscription.deleted`**: Cleans up subscription data
- **`invoice.payment_failed`**: Logs failed payments

Features:

- Idempotent credit grants (prevents duplicates)
- Automatic customer-to-user mapping
- Transaction-based credit updates
- Comprehensive logging

#### Credit Management (`functions/src/credits.ts`)

Helper functions for:

- `consumeCreditOrThrow()`: Deduct credits with error handling
- `hasCredits()`: Check credit availability
- `getUserCredits()`: Get current balance
- `grantCredits()`: Server-side credit provisioning

---

### 4. Frontend Components

#### Paywall Component (`src/components/Paywall.tsx`)

- Blocks access until user has subscription or credits
- Beautiful pricing page with two tiers
- Redirects to Stripe Checkout
- Automatic access grant on payment

#### Credits Banner (`src/components/CreditsBanner.tsx`)

- Shows current credit balance
- Subscription status indicator
- Color-coded based on credit level
- Auto-refreshes every 30 seconds
- Quick link to credits management

#### Credits Dashboard (`src/app/credits/page.tsx`)

- Full credits management interface
- Current status display
- Subscription and top-up options
- Transaction initiation

#### Success/Cancel Pages

- **`src/app/credits/success/page.tsx`**: Post-payment success page
- **`src/app/credits/cancel/page.tsx`**: Payment cancellation page

#### Updated Admin Dashboard (`src/app/admin/page.tsx`)

- Wrapped with Paywall component
- Integrated CreditsBanner
- Link to credits page
- Protected from unauthorized access

---

## Pricing Structure

### Monthly Subscription

- **Price**: $29/month (example)
- **Product ID**: `prod_TEaEffY60JvnBc`
- **Price ID**: `price_1SI73dHEYmBmUXRrgSZHNK8D`
- **Features**: Unlimited access, AI chatbot, voice calls, priority support

**Required Stripe Metadata:**

- Key: `monthlyCredits`
- Value: `500` (or your desired amount)

### Credit Top-up

- **Price**: $9/100 credits (example)
- **Product ID**: `prod_TEm6R171wTtl3A`
- **Price ID**: `price_1SIIXyHEYmBmUXRrd6qPYKoJ`
- **Features**: One-time purchase, no expiration

**Required Stripe Metadata:**

- Key: `credits`
- Value: `100` (or your desired amount)

---

## User Flow

### First-Time User (No Subscription/Credits)

1. User signs up and logs in
2. User navigates to `/admin`
3. Paywall component checks for subscription/credits
4. User sees pricing page with two options
5. User clicks "Subscribe Now" or "Buy Credits"
6. Redirected to Stripe Checkout
7. Completes payment
8. Stripe sends webhook to Firebase Function
9. Function grants credits to user
10. User redirected to success page
11. User can now access admin dashboard

### Existing Subscriber

1. User logs in
2. Navigates to `/admin`
3. Paywall checks subscription status
4. Access granted immediately
5. CreditsBanner shows current balance
6. User can manage subscription at `/credits`

### Credit Consumption

1. User performs billable action (e.g., API call)
2. Server calls `consumeCreditOrThrow(userId)`
3. Credit deducted in transaction
4. Ledger entry created
5. If insufficient credits → Error returned
6. User sees "insufficient credits" message
7. User can buy more credits or subscribe

---

## Installation & Setup

### 1. Install Dependencies

```bash
# Next.js app
cd movienta
npm install

# Firebase Functions
cd movienta/functions
npm install
```

### 2. Configure Stripe Products

1. Go to Stripe Dashboard → Products
2. Find your existing products
3. Add metadata to price objects:
   - Subscription: `monthlyCredits` = `500`
   - Top-up: `credits` = `100`

### 3. Set Environment Variables

Create `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_SUBSCRIPTION=price_1SI73dHEYmBmUXRrgSZHNK8D
STRIPE_PRICE_TOPUP=price_1SIIXyHEYmBmUXRrd6qPYKoJ
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### 4. Deploy Firebase Functions

```bash
cd movienta/functions
npm run build
firebase deploy --only functions
```

Copy the webhook URL from deployment output.

### 5. Configure Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint with your function URL
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy signing secret

### 6. Set Firebase Secrets

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

### 7. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 8. Test

```bash
cd movienta
npm run dev
```

Visit `http://localhost:3000/admin` and test the payment flow.

---

## Files Created/Modified

### New Files

```
src/lib/stripe.ts
src/app/api/checkout/monthly/route.ts
src/app/api/checkout/topup/route.ts
src/app/api/credits/summary/route.ts
src/components/Paywall.tsx
src/components/CreditsBanner.tsx
src/app/credits/page.tsx
src/app/credits/success/page.tsx
src/app/credits/cancel/page.tsx
functions/src/index.ts (updated)
functions/src/credits.ts
STRIPE_SETUP.md
ENV_SETUP.md
PAYMENT_IMPLEMENTATION_SUMMARY.md
```

### Modified Files

```
firestore.rules
src/app/admin/page.tsx
package.json (both root and functions)
```

---

## Credit Consumption Example

To consume credits in your API routes:

```typescript
// In any API route
import { consumeCreditOrThrow } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  // Verify user
  const token = await user.getIdToken();
  const decoded = await admin.auth().verifyIdToken(token);
  const uid = decoded.uid;

  // Consume credit (throws if insufficient)
  try {
    await consumeCreditOrThrow(uid, "optional-tracking-id");
  } catch (error) {
    if (error.message === "NO_CREDITS") {
      return NextResponse.json(
        {
          error: "Insufficient credits. Please subscribe or buy more credits.",
        },
        { status: 402 } // Payment Required
      );
    }
    throw error;
  }

  // Continue with your logic...
  // User has been charged 1 credit
}
```

---

## Monitoring & Maintenance

### Check Webhook Deliveries

- Stripe Dashboard → Developers → Webhooks
- View recent events and responses
- Check for failed deliveries

### View Firebase Logs

```bash
firebase functions:log --only stripeWebhook
```

### Query Firestore

```javascript
// Get user credits
const userDoc = await admin.firestore().collection("users").doc(uid).get();
const credits = userDoc.data()?.credits?.current ?? 0;

// Get ledger entries
const ledger = await admin
  .firestore()
  .collection("users")
  .doc(uid)
  .collection("credits_ledger")
  .orderBy("createdAt", "desc")
  .limit(10)
  .get();
```

---

## Security Considerations

1. **Firestore Rules**: Only server can write credits
2. **Webhook Verification**: Signature verification prevents fraud
3. **Idempotency**: Duplicate events don't grant credits twice
4. **Transactions**: Credit updates are atomic
5. **Token Verification**: All API routes verify Firebase ID tokens

---

## Production Checklist

Before going live:

- [ ] Replace all test Stripe keys with live keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Create production webhook endpoint
- [ ] Set production secrets in Firebase Functions
- [ ] Deploy all Firebase resources
- [ ] Test full payment flow with live keys
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure billing alerts in Stripe
- [ ] Review and adjust credit pricing
- [ ] Test subscription cancellation flow
- [ ] Document customer support procedures

---

## Troubleshooting

### Credits not appearing after payment

1. Check Stripe webhook delivery status
2. Review Firebase Functions logs
3. Verify price metadata is correct
4. Ensure webhook secret is set

### Paywall not working

1. Check API route authentication
2. Verify Firebase Admin SDK is initialized
3. Check browser console for errors
4. Ensure user is authenticated

### Webhook signature errors

1. Verify webhook secret matches Stripe
2. Check function URL is correct
3. Ensure using deployed function (not localhost)

---

## Next Steps

1. **Customize Pricing**: Adjust tiers and credit amounts
2. **Add More Tiers**: Create additional subscription plans
3. **Usage Analytics**: Track credit consumption patterns
4. **Email Notifications**: Alert users on low credits
5. **Subscription Management**: Add upgrade/downgrade UI
6. **Referral System**: Bonus credits for referrals
7. **Usage Dashboard**: Detailed credit usage history

---

## Support & Documentation

- **Stripe Setup**: See `STRIPE_SETUP.md`
- **Environment Variables**: See `ENV_SETUP.md`
- **Firebase**: See `FIREBASE_SETUP.md`

For issues, check:

1. Firebase Functions logs
2. Stripe webhook delivery logs
3. Browser console errors
4. Firestore data structure

---

## Summary

✅ Complete payment system implemented
✅ Subscription and one-time purchases supported
✅ Automatic credit provisioning
✅ Secure paywall protection
✅ Beautiful, responsive UI
✅ Production-ready code
✅ Comprehensive documentation

Your payment system is ready for deployment! 🚀
