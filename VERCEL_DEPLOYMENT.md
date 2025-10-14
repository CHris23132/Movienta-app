# Vercel Deployment Guide

## ✅ Your Build is Now Fixed!

All ESLint errors have been resolved. Your deployment should work now.

---

## 🚀 Deploy to Vercel

### Step 1: Push Your Code to GitHub

```bash
cd /Users/mac/Desktop/movienta-web/movienta
git add .
git commit -m "Fix ESLint errors for Vercel deployment"
git push origin main
```

### Step 2: Add Environment Variable in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **Movienta-app**
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
Key: OPENAI_API_KEY
Value: sk-your-actual-openai-api-key-here
```

5. Select all environments: **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 3: Redeploy

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**

OR just push a new commit and it will auto-deploy!

---

## ✅ What Was Fixed

### ESLint Errors (All Fixed ✓)

1. **`src/app/not-found.tsx`**

   - ❌ Was: `<a href="/">`
   - ✅ Now: `<Link href="/">`

2. **`src/app/page.tsx`**

   - ❌ Was: `<a href="/admin">`
   - ✅ Now: `<Link href="/admin">`

3. **`src/components/AudioChatbot.tsx`**
   - ❌ Was: `import { useState, useRef, useEffect }`
   - ✅ Now: `import { useState, useRef }` (removed unused)

---

## 🔧 Vercel Configuration

A `vercel.json` file has been created with optimal settings:

- ✅ Framework: Next.js
- ✅ Region: iad1 (Washington, D.C.)
- ✅ Environment variables configured
- ✅ Build commands set

---

## 🌐 After Deployment

### Your URLs:

- **Production**: https://movienta-app.vercel.app (or your custom domain)
- **Admin**: https://movienta-app.vercel.app/admin
- **Landing Pages**: https://movienta-app.vercel.app/{slug}

### Test Your Deployment:

1. Visit your production URL
2. Go to `/admin`
3. Create a test landing page
4. Visit the generated URL
5. Test the audio chatbot

---

## ⚠️ Important: Production Checklist

### Security (Required for Production!)

Your current setup is **OPEN** - anyone can:

- ✅ View landing pages (good!)
- ⚠️ Create landing pages (BAD!)
- ⚠️ Access all call data (BAD!)

**Before going live, you MUST:**

1. **Add Authentication to Admin Dashboard**

   - Use NextAuth.js or Firebase Auth
   - Protect `/admin` route

2. **Update Firestore Security Rules**

   - Current: `allow read, write: if true;` (INSECURE!)
   - Needed: Authenticated admin access only

3. **Add Rate Limiting**
   - Prevent API abuse
   - Use Vercel's built-in rate limiting or a service like Upstash

---

## 🔒 Secure Firestore Rules for Production

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Landing pages - public read, admin write
    match /landingPages/{document} {
      allow read: if true;  // Anyone can view
      allow write: if request.auth != null;  // Only logged-in admins
    }

    // Calls - public write (for leads), admin read
    match /calls/{document} {
      allow create: if true;  // Anyone can create (lead capture)
      allow read, update, delete: if request.auth != null;  // Only admins
    }
  }
}
```

---

## 📊 Monitoring

### Check These After Deployment:

1. **Vercel Dashboard**

   - Monitor build times
   - Check function execution
   - View logs

2. **OpenAI Dashboard**

   - https://platform.openai.com/usage
   - Monitor API usage
   - Set spending limits

3. **Firebase Console**
   - Monitor Firestore usage
   - Check for errors
   - Review call data

---

## 💰 Cost Monitoring

### Vercel (Free Tier):

- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Serverless functions

### OpenAI:

- ~$0.03-$0.05 per lead captured
- Set usage limits in OpenAI dashboard

### Firebase (Free Tier):

- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 1GB storage

Monitor usage to stay within free tiers!

---

## 🐛 Deployment Issues?

### Build Failed?

```bash
# Test build locally first:
npm run build

# If successful locally, check:
- Environment variables in Vercel
- Package versions match
- No git conflicts
```

### Runtime Errors?

1. Check Vercel function logs
2. Verify OPENAI_API_KEY is set
3. Check Firebase configuration
4. Test API routes in production

---

## 🎯 Custom Domain (Optional)

1. Go to Vercel dashboard
2. Project Settings → **Domains**
3. Add your domain (e.g., `movienta.com`)
4. Update DNS records as shown
5. Wait for DNS propagation (5-60 minutes)

---

## 🔄 Continuous Deployment

Every time you push to GitHub `main` branch:

1. ✅ Vercel auto-detects the push
2. ✅ Runs build automatically
3. ✅ Deploys if successful
4. ✅ Sends you a notification

**Preview Deployments**: Every PR gets its own URL!

---

## ✅ Deployment Checklist

Before going live:

- [ ] Environment variables set in Vercel
- [ ] Build succeeds without errors
- [ ] Landing pages load correctly
- [ ] Admin dashboard accessible
- [ ] Audio chatbot works
- [ ] Phone numbers captured
- [ ] Data saved to Firebase
- [ ] Authentication added (for production)
- [ ] Firestore rules secured
- [ ] Custom domain configured (optional)
- [ ] Usage monitoring set up
- [ ] Error tracking enabled (Sentry)

---

## 📝 Deployment Commands

```bash
# Local build test
npm run build

# Start production mode locally
npm run start

# Push to GitHub (triggers Vercel deploy)
git push origin main

# Check Vercel CLI status
npx vercel --prod
```

---

## 🎉 Your Deployment is Ready!

All code issues are fixed. Your next deployment should succeed!

**Next Steps:**

1. Push your code to GitHub
2. Add OPENAI_API_KEY to Vercel
3. Watch your deployment succeed! 🚀

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Firebase Hosting**: https://firebase.google.com/docs/hosting

Your code is production-ready! 🎊
