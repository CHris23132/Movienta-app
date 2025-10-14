# ⚡ Quick Start Guide

## 🚀 Get Running in 3 Minutes

### Step 1: Setup Environment (1 min)

Create `.env.local` file in the `movienta` directory:

```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
```

Replace `sk-your-key-here` with your actual OpenAI API key from https://platform.openai.com/api-keys

### Step 2: Start Server (1 min)

```bash
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

### Step 3: Create Your First Page (1 min)

1. Open: http://localhost:3000/admin
2. Click: **"+ Create New Landing Page"**
3. Fill in:
   - **Brand Name**: MyBusiness
   - **Hero Title**: Welcome to MyBusiness
   - **Hero Subtitle**: We help you succeed
   - **AI Prompt**: Ask about their company name, industry, and when they want to get started
   - **Theme Color**: (pick any)
4. Click: **"Create Landing Page"**
5. Visit: http://localhost:3000/mybusiness

### Step 4: Test It! 🎉

1. Click **"Start Conversation"**
2. Click the **microphone button** 🎤
3. Say: _"My number is 555-123-4567"_
4. Continue the conversation!
5. Check Firebase Console → `calls` collection to see your data

---

## 🎯 What You Just Built

✅ AI-powered landing pages  
✅ Voice chatbot with natural conversation  
✅ Automatic phone number capture  
✅ Lead data saved to Firebase  
✅ Custom branding per page

---

## 📱 URLs You Need

| Page               | URL                          |
| ------------------ | ---------------------------- |
| Home               | http://localhost:3000        |
| Admin Dashboard    | http://localhost:3000/admin  |
| Your Landing Pages | http://localhost:3000/{slug} |

---

## 🔧 Configuration Files

| File                  | Purpose                       |
| --------------------- | ----------------------------- |
| `.env.local`          | API keys (create this!)       |
| `src/lib/firebase.ts` | Firebase config (already set) |
| `src/app/api/*`       | Backend API routes            |

---

## 🆘 Troubleshooting

**"Cannot find module 'openai'"**  
→ Run: `npm install`

**"Microphone not accessible"**  
→ Use Chrome/Firefox, allow mic permissions

**"Invalid API key"**  
→ Check `.env.local` has correct OpenAI key

**"Firebase error"**  
→ Update Firestore rules in Firebase Console

---

## 📖 More Help

- Detailed docs: `README.md`
- Setup guide: `SETUP.md`
- Full instructions: `INSTRUCTIONS.txt`
- System overview: `SYSTEM_OVERVIEW.md`

---

## ⚡ Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🎉 You're Ready!

Your AI audio chatbot system is fully functional and ready to capture leads through natural voice conversations!

**Happy building!** 🚀
