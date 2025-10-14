# Troubleshooting Guide

## "Failed to start call" Error

If you see this error when clicking "Start Conversation", here are the steps to fix it:

### Step 1: Check Firebase Rules

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `connect-now-16778`
3. Go to **Firestore Database** → **Rules**
4. Make sure your rules look like this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish** if you made changes

### Step 2: Check Browser Console

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Look for error messages with more details
4. Common errors:
   - "Missing or insufficient permissions" → Fix Firestore rules
   - "Network error" → Check internet connection
   - "Landing page ID is required" → Landing page not loading correctly

### Step 3: Verify Landing Page Exists

1. Check the browser URL - you should be at `http://localhost:3000/{slug}`
2. Make sure the page loaded correctly (not 404)
3. Open DevTools Network tab
4. Look for the `/api/calls` request
5. Check the request payload has `landingPageId`

### Step 4: Check Server Logs

In your terminal where `npm run dev` is running, look for:

```
Creating call for landing page: [some-id]
Call created with ID: [some-id]
```

If you see errors here, they'll tell you what's wrong.

### Step 5: Restart Dev Server

Sometimes a restart fixes issues:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## Common Issues & Solutions

### Issue: "Microphone not accessible"

**Solution:**

- Use Chrome or Firefox (Safari has issues)
- Allow microphone permissions when prompted
- Make sure you're on `localhost` or `https://`
- Check System Preferences → Security → Microphone

### Issue: "Failed to transcribe audio"

**Solution:**

- Check your OpenAI API key in `.env.local`
- Verify you have credits in OpenAI account: https://platform.openai.com/usage
- Make sure the audio is recording (check browser console)
- Try speaking louder or closer to microphone

### Issue: "Landing page not found" (404)

**Solution:**

- Go to `/admin` and verify the page exists
- Check the slug matches the URL
- Create a new test page: `/admin`

### Issue: "Invalid API key"

**Solution:**

1. Check `.env.local` exists in the `movienta` folder
2. Verify format: `OPENAI_API_KEY=sk-...`
3. Make sure there are no spaces or quotes around the key
4. Restart dev server after changing `.env.local`

### Issue: Audio plays but no response

**Solution:**

- Check OpenAI API quota/billing
- Look at browser console for errors
- Check Network tab for failed API calls
- Verify `/api/chat` is working

### Issue: Phone number not detected

**Solution:**
The system recognizes these formats:

- `123-456-7890`
- `(123) 456-7890`
- `123.456.7890`
- `1234567890`

Try saying your number clearly, digit by digit, or in one of these formats.

---

## Debug Mode

### Enable Detailed Logging

The system now has enhanced logging. Check:

1. **Browser Console** - Client-side logs
2. **Terminal** - Server-side logs from API routes
3. **Network Tab** - HTTP request/response details

### Test API Routes Manually

You can test API routes directly:

#### Test Call Creation:

```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{"landingPageId":"test-id","openingMessage":"Hello"}'
```

Expected response:

```json
{ "callId": "some-id", "message": "Call created successfully" }
```

#### Test Landing Page Creation:

```bash
curl -X POST http://localhost:3000/api/landing-pages \
  -H "Content-Type: application/json" \
  -d '{
    "brandName":"Test",
    "heroTitle":"Test Title",
    "heroSubtitle":"Test Subtitle",
    "customPrompt":"Ask test questions"
  }'
```

---

## Still Having Issues?

### Check These Files:

1. **`.env.local`** - Has your OpenAI API key
2. **`src/lib/firebase.ts`** - Firebase config is correct
3. **Firestore Rules** - Allow read/write access
4. **Browser Console** - Look for detailed error messages
5. **Terminal Logs** - Check server-side errors

### Get More Help:

1. Check all 7 documentation files
2. Review `SETUP.md` for initial setup
3. See `SYSTEM_OVERVIEW.md` for architecture
4. Read `INSTRUCTIONS.txt` for detailed guide

---

## Quick Fixes Checklist

- [ ] `.env.local` exists with valid OpenAI API key
- [ ] Firestore rules allow read/write
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser allows microphone access
- [ ] Using Chrome or Firefox (not Safari)
- [ ] Landing page exists in admin dashboard
- [ ] OpenAI account has credits
- [ ] Internet connection is stable

---

## Need to Reset Everything?

```bash
# Stop server
Ctrl+C

# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart
npm run dev
```

---

## Contact Support

If you're still stuck:

1. Copy the error message from browser console
2. Copy the error message from terminal
3. Note what step you were on
4. Check the documentation files for similar issues

The enhanced logging should now show exactly what's failing!
