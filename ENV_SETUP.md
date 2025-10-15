# Environment Variables Setup Guide

This document lists all required environment variables for the Movienta application.

## Required Environment Variables

### Firebase Configuration (Client-side)

These are public variables for the Firebase client SDK:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Where to find these:**

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Select your web app or create one
4. Copy the config values

### Firebase Admin SDK (Server-side)

For server-side Firebase operations:

```env
# Local development: path to service account JSON file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Production (Vercel): paste entire JSON content
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**How to get service account:**

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. For local: use file path
5. For production: paste entire JSON content as environment variable

### Stripe Configuration

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...

# Stripe Product IDs
STRIPE_PRODUCT_SUBSCRIPTION=prod_TEaEffY60JvnBc
STRIPE_PRODUCT_TOPUP=prod_TEm6R171wTtl3A

# Stripe Price IDs
STRIPE_PRICE_SUBSCRIPTION=price_1SI73dHEYmBmUXRrgSZHNK8D
STRIPE_PRICE_TOPUP=price_1SIIXyHEYmBmUXRrd6qPYKoJ

# Optional: API Version (defaults to 2024-06-20)
STRIPE_API_VERSION=2024-06-20
```

**Where to find these:**

1. Stripe Dashboard → Developers → API Keys
2. Copy "Publishable key" and "Secret key"
3. Use test keys for development
4. Use live keys for production

### OpenAI Configuration

```env
OPENAI_API_KEY=sk-...
```

**Where to find:**

1. Go to platform.openai.com
2. Navigate to API keys
3. Create new secret key

### Application Configuration

```env
# Your application URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Local
NEXT_PUBLIC_APP_URL=https://your-domain.com  # Production
```

---

## Firebase Functions Environment (Secrets)

For Firebase Functions, use Firebase Secrets (more secure than environment variables):

```bash
# Set Stripe secret key
firebase functions:secrets:set STRIPE_SECRET_KEY

# Set Stripe webhook secret
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

**Note:** The webhook secret comes from Stripe Dashboard → Developers → Webhooks after creating an endpoint.

---

## Setup Instructions

### Local Development

1. Create `.env.local` in the `movienta` directory:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in all values in `.env.local`

3. Never commit `.env.local` to git (it's in `.gitignore`)

### Vercel Production

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add each variable:

   - Name: Variable name (e.g., `STRIPE_SECRET_KEY`)
   - Value: The actual value
   - Environment: Select Production, Preview, Development as needed

3. Important for Firebase Admin:

   ```
   Name: GOOGLE_APPLICATION_CREDENTIALS
   Value: Paste entire JSON content (minified, no line breaks)
   ```

4. Redeploy after adding variables

### Firebase Functions

1. Set secrets using Firebase CLI:

   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   ```

2. Deploy functions:
   ```bash
   cd functions
   firebase deploy --only functions
   ```

---

## Environment-Specific Values

### Development

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

---

## Security Best Practices

1. **Never commit secrets to git**

   - Use `.env.local` for local development
   - Use Vercel environment variables for production
   - Use Firebase Secrets for cloud functions

2. **Use test keys in development**

   - Stripe test keys start with `sk_test_` and `pk_test_`
   - Switch to live keys only in production

3. **Rotate keys periodically**

   - Regenerate Stripe keys every few months
   - Update Firebase service accounts as needed

4. **Limit key permissions**

   - Use restricted API keys where possible
   - Firebase service account should have minimal permissions

5. **Monitor key usage**
   - Check Stripe dashboard for unusual activity
   - Review Firebase usage regularly

---

## Troubleshooting

### "Invalid API key" errors

- Check that you're using the correct key for the environment (test vs live)
- Ensure no extra spaces or line breaks in the key
- Verify the key is still active in Stripe/Firebase dashboard

### Firebase Admin initialization errors

- For local: Check that `GOOGLE_APPLICATION_CREDENTIALS` points to valid JSON file
- For Vercel: Ensure the JSON is properly formatted (no line breaks)
- Verify the service account has necessary permissions

### Webhook signature verification fails

- Confirm `STRIPE_WEBHOOK_SECRET` is set correctly in Firebase Functions
- Ensure you're using the correct webhook endpoint URL
- Check that the secret matches the one in Stripe Dashboard

---

## Checklist

Before deploying to production:

- [ ] All Firebase config variables set
- [ ] Stripe live keys configured
- [ ] Firebase service account JSON set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Firebase Functions secrets set (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
- [ ] Stripe webhook endpoint created and pointing to production function
- [ ] OpenAI API key set
- [ ] Test the entire payment flow in production

---

## Getting Help

If you encounter issues:

1. Check Firebase Functions logs: `firebase functions:log`
2. Check Vercel deployment logs
3. Verify environment variables are set correctly
4. Test with Stripe test mode first
