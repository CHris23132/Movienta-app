# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd movienta
npm install
```

## Step 2: Set Up OpenAI API Key

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env.local` file in the `movienta` directory:

```bash
touch .env.local
```

3. Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

## Step 3: Verify Firebase Configuration

Firebase is already configured in `src/lib/firebase.ts`. The configuration is set to use your existing Firebase project.

## Step 4: Set Up Firestore Security Rules

Update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to landing pages
    match /landingPages/{document} {
      allow read: if true;
      allow write: if true; // Add authentication later
    }

    // Allow public write access to calls (for lead capture)
    match /calls/{document} {
      allow read, write: if true;
    }
  }
}
```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Create Your First Landing Page

1. Go to http://localhost:3000/admin
2. Click "Create New Landing Page"
3. Fill in:
   - **Brand Name**: "Test Company" (creates URL: /test-company)
   - **Hero Title**: "Welcome to Our Service"
   - **Hero Subtitle**: "We help businesses grow"
   - **AI Chatbot Prompt**: "Ask about their business needs, industry, and timeline for implementation"
   - **Theme Color**: Choose any color
4. Click "Create Landing Page"
5. Visit your new page at http://localhost:3000/test-company

## Step 7: Test the Audio Chatbot

1. On your landing page, click "Start Conversation"
2. The AI will ask for your phone number
3. Click the microphone button and speak your phone number
4. Continue the conversation as the AI asks follow-up questions
5. Check Firebase Console → Firestore → "calls" collection to see saved data

## Troubleshooting

### "Microphone not accessible"

- Make sure you're using Chrome/Firefox
- Allow microphone permissions when prompted
- Use HTTPS or localhost (http://localhost works)

### "Failed to transcribe audio"

- Check your OpenAI API key in `.env.local`
- Verify you have credits in your OpenAI account
- Check the browser console for detailed errors

### "Failed to create landing page"

- Verify Firebase configuration
- Check Firestore security rules allow writes
- Look at browser console for errors

### Module not found errors

- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Next Steps

- Add authentication to the admin dashboard
- Customize the opening message
- Add more fields to capture
- Integrate with your CRM
- Add email notifications when calls are received
- Deploy to Vercel

## Need Help?

Check the main README.md for more detailed documentation.
