# Payment System Quick Start Guide

Get your Stripe payment system up and running in 15 minutes.

## Prerequisites

- [x] Firebase project created
- [x] Stripe account created
- [x] Node.js 18+ installed
- [x] Firebase CLI installed (`npm install -g firebase-tools`)

---

## Step 1: Install Dependencies (2 minutes)

```bash
# In movienta directory
cd movienta
npm install

# In functions directory
cd functions
npm install
cd ..
```

---

## Step 2: Configure Stripe Metadata (3 minutes)

### Important: Add metadata to your Stripe prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) → Products

2. Click on **Movienta Subscription** → Price `price_1SI73dHEYmBmUXRrgSZHNK8D`

   - Click "Edit" or scroll to "Metadata"
   - Add: Key = `monthlyCredits`, Value = `500`
   - Save

3. Click on **Movienta Credit Top Up** → Price `price_1SIIXyHEYmBmUXRrd6qPYKoJ`
   - Click "Edit" or scroll to "Metadata"
   - Add: Key = `credits`, Value = `100`
   - Save

**Without this metadata, credits won't be granted!**

---

## Step 3: Set Up Environment Variables (3 minutes)

Create `.env.local` in the `movienta` directory:

```bash
# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Stripe Product/Price IDs (already provided)
STRIPE_PRICE_SUBSCRIPTION=price_1SI73dHEYmBmUXRrgSZHNK8D
STRIPE_PRICE_TOPUP=price_1SIIXyHEYmBmUXRrd6qPYKoJ

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Admin (path to your service account JSON)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json

# OpenAI (if you need it)
OPENAI_API_KEY=sk-YOUR_KEY_HERE

# Firebase Config (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Step 4: Deploy Firebase Functions (3 minutes)

```bash
cd functions

# Build the functions
npm run build

# Deploy to Firebase
firebase deploy --only functions

# You'll see output like:
# ✔ functions[stripeWebhook(us-central1)] Successful create operation.
# Function URL: https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook

# Copy the webhook URL!
```

---

## Step 5: Set Firebase Secrets (2 minutes)

```bash
# Still in functions directory

# Set Stripe secret key
firebase functions:secrets:set STRIPE_SECRET_KEY
# Paste your sk_test_... key when prompted

# Set webhook secret (you'll get this in next step)
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
# For now, just press Enter (we'll set it after creating the webhook)
```

---

## Step 6: Create Stripe Webhook (3 minutes)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)

2. Click "+ Add endpoint"

3. Paste your function URL from Step 4:

   ```
   https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
   ```

4. Click "Select events" and choose:

   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`

5. Click "Add endpoint"

6. Click on the newly created endpoint

7. Under "Signing secret", click "Reveal" and copy the `whsec_...` value

8. Set it in Firebase:

   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Paste the whsec_... value
   ```

9. Redeploy functions:
   ```bash
   firebase deploy --only functions
   ```

---

## Step 7: Deploy Firestore Rules (1 minute)

```bash
# From movienta directory
firebase deploy --only firestore:rules
```

---

## Step 8: Test Locally (1 minute)

```bash
# From movienta directory
npm run dev
```

Visit: http://localhost:3000/admin

You should see the paywall with pricing options!

---

## Step 9: Test Payment Flow (5 minutes)

1. If not logged in, create an account
2. You'll see the paywall
3. Click "Subscribe Now" or "Buy Credits"
4. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: `123`
   - ZIP: `12345`
5. Complete payment
6. You'll be redirected to success page
7. Check Firestore:
   - Users → [your-uid] → should have `credits` and `billing` fields

---

## Verification Checklist

After completing setup, verify:

- [ ] Stripe products have metadata (`monthlyCredits` and `credits`)
- [ ] Firebase Functions deployed successfully
- [ ] Stripe webhook created and pointing to function URL
- [ ] Webhook secret set in Firebase
- [ ] Firestore rules deployed
- [ ] Can see paywall at `/admin`
- [ ] Test payment goes through
- [ ] Credits appear in Firestore
- [ ] Can access admin dashboard after payment

---

## Common Issues & Solutions

### Issue: "Invalid API key"

**Solution**: Check that `STRIPE_SECRET_KEY` in `.env.local` starts with `sk_test_`

### Issue: Credits not appearing after payment

**Solution**:

1. Check Stripe webhook deliveries (Stripe Dashboard → Webhooks → Click your endpoint)
2. View Firebase logs: `firebase functions:log`
3. Verify price metadata is set correctly

### Issue: Paywall shows but can't click buttons

**Solution**: Check browser console for errors. Ensure all environment variables are set.

### Issue: Webhook signature verification failed

**Solution**: Ensure `STRIPE_WEBHOOK_SECRET` is set correctly in Firebase Functions

---

## Next Steps After Setup

1. **Test thoroughly** with Stripe test cards
2. **Check webhook deliveries** in Stripe Dashboard
3. **Review Firebase logs** for any errors
4. **Test credit consumption** by implementing it in your API routes
5. **Customize pricing** if needed

---

## Testing Credit Consumption

Add this to any API route where you want to charge credits:

```typescript
import { consumeCreditOrThrow } from "@/lib/stripe";

// In your API route handler
try {
  await consumeCreditOrThrow(userId);
  // Continue with your logic...
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

## Moving to Production

When ready for production:

1. Get live Stripe keys (from https://dashboard.stripe.com/apikeys)
2. Update `.env.local` with live keys
3. Create production webhook in Stripe (use same events)
4. Update `NEXT_PUBLIC_APP_URL` to your domain
5. Deploy to Vercel/your hosting
6. Set all environment variables in production
7. Update Firebase Functions secrets with live keys
8. Test with real payment methods (but small amounts!)

---

## Support Resources

- **Detailed Setup**: See `STRIPE_SETUP.md`
- **Environment Vars**: See `ENV_SETUP.md`
- **Full Documentation**: See `PAYMENT_IMPLEMENTATION_SUMMARY.md`

---

## Need Help?

Check these in order:

1. Firebase Functions logs: `firebase functions:log`
2. Stripe webhook delivery logs
3. Browser console errors
4. Firestore data structure

---

## Success! 🎉

If you can:

- ✅ See the paywall at `/admin`
- ✅ Complete a test payment
- ✅ See credits in Firestore
- ✅ Access the admin dashboard

**Your payment system is working!**

You're ready to start building your SaaS! 🚀
