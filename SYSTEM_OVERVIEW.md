# 🎯 System Overview - Movienta AI Audio Chatbot

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MOVIENTA SYSTEM                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Admin      │────────▶│   Firebase   │◀────────│   Visitor    │
│  Dashboard   │         │  Firestore   │         │    Pages     │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
┌──────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Chat   │  │Transcribe│  │   TTS   │  │  Calls  │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   OpenAI API     │
                    │  • Whisper STT   │
                    │  • GPT-4o-mini   │
                    │  • TTS-1         │
                    └──────────────────┘
```

## 🎬 User Flow

### Admin Creates Landing Page

```
Admin visits /admin
    │
    ├─▶ Fills form (brand, hero text, AI prompt, color)
    │
    ├─▶ System generates unique slug
    │
    ├─▶ Saves to Firebase "landingPages" collection
    │
    └─▶ Gets shareable link: /{slug}
```

### Visitor Interaction

```
Visitor visits /{slug}
    │
    ├─▶ Sees custom branded page
    │
    ├─▶ Clicks "Start Conversation"
    │
    ├─▶ Creates new "call" document in Firebase
    │
    ├─▶ AI speaks opening message (TTS)
    │       "Can I get your phone number?"
    │
    ├─▶ Visitor clicks microphone & speaks
    │
    ├─▶ Audio sent to Whisper API → Text
    │
    ├─▶ Text analyzed for phone number
    │       ├─ Found? ✅ Save to Firebase
    │       └─ Not found? ❌ Ask again
    │
    ├─▶ AI asks follow-up questions
    │       (based on custom prompt)
    │
    ├─▶ Each response:
    │       ├─ Transcribed (Whisper)
    │       ├─ Processed (GPT-4o-mini)
    │       ├─ Saved to Firebase
    │       └─ Spoken back (TTS)
    │
    └─▶ All data stored in "calls" collection
```

## 🗂️ Database Schema

### Collection: `landingPages`

```javascript
{
  id: "abc123",
  slug: "test-company",              // URL identifier
  brandName: "Test Company",
  heroTitle: "Welcome to Test Co",
  heroSubtitle: "We help you grow",
  customPrompt: "Ask about...",      // AI instructions
  themeColor: "#3B82F6",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `calls`

```javascript
{
  id: "xyz789",
  landingPageId: "abc123",           // Reference to landing page
  phoneNumber: "1234567890",         // ✨ Captured from speech
  status: "active",                  // or "completed"
  startedAt: Timestamp,
  endedAt: Timestamp,
  messages: [
    {
      role: "assistant",
      content: "Can I get your phone number?",
      timestamp: Timestamp
    },
    {
      role: "user",
      content: "Sure, it's 123-456-7890",
      timestamp: Timestamp
    },
    // ... more messages
  ]
}
```

## 🎤 Audio Processing Pipeline

```
User speaks
    │
    ▼
Browser captures audio (MediaRecorder API)
    │
    ▼
Audio blob sent to /api/transcribe
    │
    ▼
OpenAI Whisper converts to text
    │
    ▼
Text sent to /api/chat
    │
    ├─▶ If first message: Extract phone number
    │       └─▶ Save to Firebase
    │
    ├─▶ Build conversation context
    │
    ├─▶ Send to GPT-4o-mini with custom prompt
    │
    └─▶ Get AI response
    │
    ▼
Response sent to /api/tts
    │
    ▼
OpenAI TTS generates audio
    │
    ▼
Audio played to user
    │
    ▼
Entire exchange saved to Firebase
```

## 📁 File Structure (14 TypeScript Files)

```
src/
├── app/
│   ├── [slug]/
│   │   └── page.tsx                  # 🌐 Public landing pages
│   ├── admin/
│   │   └── page.tsx                  # 🔧 Admin dashboard
│   ├── api/
│   │   ├── calls/route.ts            # 📞 Create call sessions
│   │   ├── chat/route.ts             # 💬 AI conversation engine
│   │   ├── landing-pages/route.ts    # 📄 CRUD for pages
│   │   ├── transcribe/route.ts       # 🎙️  Speech-to-text
│   │   └── tts/route.ts              # 🔊 Text-to-speech
│   ├── layout.tsx                    # 📐 Root layout
│   ├── page.tsx                      # 🏠 Home page
│   └── not-found.tsx                 # 404 page
├── components/
│   └── AudioChatbot.tsx              # 🎤 Voice chat UI
├── lib/
│   ├── firebase.ts                   # 🔥 Firebase setup
│   └── db.ts                         # 💾 Database operations
└── types/
    └── index.ts                      # 📝 TypeScript types
```

## 🔑 Key Features

### ✅ Completed Features

- [x] Dynamic landing page generation
- [x] Unique URL slug creation
- [x] Custom branding per page
- [x] Voice-enabled chatbot
- [x] Real-time audio transcription (Whisper)
- [x] AI conversation with custom prompts (GPT-4o-mini)
- [x] Text-to-speech responses (OpenAI TTS)
- [x] Automatic phone number extraction
- [x] Pattern matching for various phone formats
- [x] Firebase Firestore integration
- [x] Conversation history tracking
- [x] Admin dashboard for page creation
- [x] Responsive UI with Tailwind CSS
- [x] Dark mode support

### 🎨 UI Components

- Modern, clean design
- Gradient hero sections
- Animated microphone button
- Real-time chat bubbles
- Processing indicators
- Error handling with user feedback
- Mobile-responsive layout

## 🔒 Security Considerations

### Current Setup (Development)

- ⚠️ Admin dashboard is **PUBLIC** (no authentication)
- ⚠️ Firestore rules allow **PUBLIC** read/write
- ⚠️ API routes are **UNPROTECTED**

### Recommended for Production

1. Add authentication to `/admin`
2. Implement Firestore security rules with user authentication
3. Add rate limiting to API routes
4. Validate and sanitize all inputs
5. Add CORS protection
6. Monitor API usage and costs

## 🚀 Performance Optimizations

### Current Implementation

- Efficient audio compression (WebM format)
- Streaming audio playback
- Minimal re-renders with React state management
- Server-side rendering for landing pages
- Client-side interactions for chatbot

### Future Optimizations

- [ ] Audio chunking for long recordings
- [ ] WebSocket for real-time updates
- [ ] Cache OpenAI responses
- [ ] CDN for audio files
- [ ] Lazy loading components

## 💰 Cost Breakdown

### OpenAI API Usage Per Conversation

- **Whisper (STT)**: ~$0.006 per minute of audio
- **GPT-4o-mini**: ~$0.0003 per conversation turn
- **TTS**: ~$0.015 per response (average)

**Estimated cost per lead**: $0.05 - $0.15

### Firebase (Free Tier)

- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB/month transfer

## 📊 Monitoring Points

### Track These Metrics

1. Landing page views
2. Conversation start rate
3. Phone number capture rate
4. Average conversation length
5. API error rates
6. Firebase read/write usage
7. OpenAI API costs

## 🎯 Next Steps for Production

1. **Security**

   - Add authentication (NextAuth.js, Firebase Auth)
   - Secure API routes
   - Update Firestore rules

2. **Features**

   - Email notifications for new leads
   - SMS notifications
   - CRM integration (Salesforce, HubSpot)
   - Analytics dashboard
   - Export leads to CSV

3. **Optimization**

   - Add caching
   - Implement CDN
   - Optimize bundle size
   - Add monitoring (Sentry, LogRocket)

4. **Testing**
   - Unit tests for API routes
   - Integration tests
   - E2E tests with Playwright
   - Load testing

## 🐛 Common Issues & Solutions

| Issue                  | Solution                                   |
| ---------------------- | ------------------------------------------ |
| Microphone not working | Enable HTTPS, check browser permissions    |
| OpenAI API errors      | Verify API key, check billing/credits      |
| Firebase errors        | Update security rules, check configuration |
| Audio not playing      | Check browser audio settings, unmute       |
| Phone extraction fails | Improve pattern matching, add fallback     |

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎉 System Status: READY TO USE!

**To start**: `npm run dev`

**Admin**: http://localhost:3000/admin

**Docs**: See INSTRUCTIONS.txt for detailed setup

---

Built with ❤️ using Next.js 15, TypeScript, Firebase, and OpenAI
