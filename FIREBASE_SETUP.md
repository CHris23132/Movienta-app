# Firebase Setup Guide

## Issue: "Failed to start call"

This error typically means Firebase Firestore isn't properly configured. Here's how to fix it:

---

## Step 1: Check Firestore Database Exists

1. Go to: https://console.firebase.google.com
2. Select project: **connect-now-16778**
3. In the left sidebar, click **Firestore Database**

### If you see "Create database":

1. Click **Create database**
2. Choose **Start in production mode** (we'll update rules)
3. Select your location (closest to you)
4. Click **Enable**

### If database already exists:

Continue to Step 2

---

## Step 2: Update Firestore Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the content with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public access to all documents (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**
4. Wait for "Rules published successfully" message

**Note**: These open rules are for DEVELOPMENT only. For production, add authentication!

---

## Step 3: Verify Collections

After you fix the rules and try to start a conversation:

1. Go to Firestore Database → **Data** tab
2. You should see these collections appear:
   - `landingPages` - Your created pages
   - `calls` - Conversation records

If you don't see these, the app hasn't written to Firebase yet.

---

## Step 4: Test the Connection

### Create a Test Landing Page:

1. Go to: http://localhost:3000/admin
2. Create a test page:
   - Brand: "Test"
   - Title: "Test Page"
   - Subtitle: "Testing"
   - Prompt: "Ask about their name"
3. Click "Create Landing Page"

### Check Firestore:

1. Go to Firebase Console → Firestore
2. Click on `landingPages` collection
3. You should see your test page

If this works, Firebase write is working!

---

## Step 5: Test Call Creation

1. Visit your landing page: http://localhost:3000/test
2. Click "Start Conversation"
3. Check browser console (F12) for errors
4. Check terminal for server logs

### Expected logs:

**Browser Console:**

```
Received request body: {landingPageId: "...", openingMessage: "..."}
```

**Terminal:**

```
Creating call for landing page: abc123
[DB] Creating call for landing page: abc123
[DB] Call created successfully with ID: xyz789
Call created with ID: xyz789
Adding opening message
```

### If you see errors:

Check the specific error message. Common ones:

#### "Missing or insufficient permissions"

→ Fix Firestore rules (Step 2)

#### "PERMISSION_DENIED"

→ Firestore rules not published correctly

#### "Network error"

→ Check internet connection

---

## Common Firebase Issues

### Issue: "FirebaseError: 7 PERMISSION_DENIED"

**Solution:**

```javascript
// Your rules should look like this:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Issue: "Collection doesn't exist"

**Solution:**
Collections are created automatically when you write the first document. They don't need to be pre-created.

### Issue: "Firebase not initialized"

**Solution:**
Check `src/lib/firebase.ts` has your correct Firebase config:

- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId

These are already configured in your project!

---

## Verify Your Configuration

Your Firebase config in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBtr7FOGmKDuwNVVcQWZbeaTvGW1TTd0Y4",
  authDomain: "connect-now-16778.firebaseapp.com",
  projectId: "connect-now-16778",
  storageBucket: "connect-now-16778.firebasestorage.app",
  messagingSenderId: "954438888605",
  appId: "1:954438888605:web:a3ce39dc04f45f52eaf874",
};
```

This should match your Firebase project settings!

---

## Check Firebase Project Settings

1. Go to Firebase Console
2. Click the gear icon (⚙️) → **Project settings**
3. Scroll to **Your apps**
4. Find your web app
5. Verify the config matches `src/lib/firebase.ts`

---

## Testing Firebase Directly

You can test if Firebase is working by running this in browser console:

```javascript
// On any page of your app
fetch("/api/landing-pages")
  .then((r) => r.json())
  .then(console.log);
```

If this works, Firebase read is working!

---

## Still Not Working?

### 1. Check Browser Console

Look for red error messages. They'll tell you exactly what's wrong.

### 2. Check Terminal Logs

Your server logs will show Firebase errors.

### 3. Verify Firestore is Enabled

- Go to Firebase Console
- Make sure Firestore Database shows "Data" not "Create database"

### 4. Restart Everything

```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

### 5. Try Incognito Mode

Sometimes browser cache causes issues. Try in a private/incognito window.

---

## Production Security (Important!)

The current rules allow ANYONE to read/write your database. This is fine for development but INSECURE for production!

### For Production:

1. Add Firebase Authentication
2. Update rules to require authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Landing pages - public read, admin write
    match /landingPages/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Calls - public write (for lead capture), admin read
    match /calls/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

---

## Summary Checklist

- [ ] Firestore Database is created
- [ ] Firestore rules are set to allow all (for dev)
- [ ] Rules are published
- [ ] Can create landing pages in admin dashboard
- [ ] Landing pages appear in Firestore
- [ ] Can visit landing page URLs
- [ ] Browser console shows no Firebase errors
- [ ] Terminal shows successful database operations

Once all checkboxes are checked, the system should work!

---

## Need Help?

Check these files:

- `TROUBLESHOOTING.md` - General issues
- `SETUP.md` - Initial setup
- `INSTRUCTIONS.txt` - Full guide

Your Firebase is already configured - you just need to:

1. ✅ Enable Firestore (if not done)
2. ✅ Set permissive rules for development
3. ✅ Restart server

That's it! 🎉
