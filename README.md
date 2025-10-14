# Movienta - AI-Powered Landing Page System

An intelligent landing page system with audio-enabled AI chatbot that captures leads through natural voice conversations.

## Features

- 🎨 **Custom Landing Pages**: Create branded landing pages with custom hero text and styling
- 🎙️ **Voice-Enabled AI Chatbot**: Real-time audio conversations powered by OpenAI
- 📞 **Smart Lead Capture**: Automatically extracts phone numbers and relevant information
- 🔥 **Firebase Integration**: Real-time data storage and retrieval
- 🌐 **Dynamic URLs**: Each brand gets a unique, shareable link
- 💬 **Intelligent Conversations**: Custom AI prompts for targeted information gathering

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Firebase Firestore** - Real-time database
- **OpenAI API** - Whisper (STT), GPT-4 (Chat), TTS (Text-to-Speech)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- OpenAI API key

### Installation

1. Clone the repository:

```bash
cd movienta
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. Configure Firebase:

Update `src/lib/firebase.ts` with your Firebase configuration (already configured in this project).

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Landing Page

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click "Create New Landing Page"
3. Fill in the form:
   - **Brand Name**: Your company/brand name (used for URL slug)
   - **Hero Title**: Main headline on the landing page
   - **Hero Subtitle**: Supporting text below the headline
   - **AI Chatbot Custom Prompt**: Instructions for what information the AI should gather
   - **Theme Color**: Brand color for the page
4. Click "Create Landing Page"
5. Access your new page at `/{slug}`

### How the AI Chatbot Works

1. **Opening**: Automatically asks for the visitor's phone number
2. **Phone Capture**: Uses pattern matching to extract phone numbers from speech
3. **Follow-up**: Asks relevant questions based on your custom prompt
4. **Storage**: All interactions are saved to Firebase in the "calls" collection

### Voice Conversation Flow

```
User visits /{slug}
  → Clicks "Start Conversation"
  → AI: "I know you'd probably rather speak to a live sales representative..."
  → User provides phone number (via voice)
  → Phone number saved to Firebase
  → AI: Asks follow-up questions based on custom prompt
  → All responses saved to "calls" collection
```

## Project Structure

```
movienta/
├── src/
│   ├── app/
│   │   ├── [slug]/           # Dynamic landing pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # API routes
│   │   │   ├── calls/        # Call management
│   │   │   ├── chat/         # AI chat processing
│   │   │   ├── landing-pages/# Landing page CRUD
│   │   │   ├── transcribe/   # Speech-to-text
│   │   │   └── tts/          # Text-to-speech
│   │   ├── page.tsx          # Home page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── AudioChatbot.tsx  # Voice chat component
│   ├── lib/
│   │   ├── firebase.ts       # Firebase config
│   │   └── db.ts             # Database operations
│   └── types/
│       └── index.ts          # TypeScript types
├── public/                   # Static assets
└── package.json
```

## Firebase Collections

### `landingPages`

```typescript
{
  id: string;
  slug: string;
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  customPrompt: string;
  themeColor?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `calls`

```typescript
{
  id: string;
  landingPageId: string;
  phoneNumber?: string;
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed';
}
```

## API Routes

- `POST /api/landing-pages` - Create a new landing page
- `GET /api/landing-pages` - Get all landing pages
- `POST /api/calls` - Create a new call session
- `POST /api/transcribe` - Transcribe audio to text (Whisper)
- `POST /api/chat` - Process chat messages with AI
- `POST /api/tts` - Generate speech from text

## Customization

### Changing the Opening Message

Edit the `OPENING_MESSAGE` constant in `src/app/[slug]/page.tsx`:

```typescript
const OPENING_MESSAGE = "Your custom opening message here...";
```

### Adjusting AI Voice

Modify the TTS voice in `src/app/api/tts/route.ts`:

```typescript
const mp3 = await openai.audio.speech.create({
  model: "tts-1",
  voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
  input: text,
});
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
4. Deploy!

### Environment Variables in Production

Make sure to set these in your production environment:

- `OPENAI_API_KEY` - Your OpenAI API key

## Security Notes

- Landing pages are publicly accessible (no authentication required)
- Admin dashboard should be protected in production (add authentication)
- API keys are stored securely in environment variables
- Consider adding rate limiting to API routes

## Browser Requirements

- Modern browser with microphone access
- HTTPS required for microphone access (automatic in production)

## Troubleshooting

### Microphone not working

- Ensure you're using HTTPS (or localhost)
- Check browser permissions
- Try a different browser

### Firebase errors

- Verify Firebase configuration in `src/lib/firebase.ts`
- Check Firestore rules allow read/write access

### OpenAI API errors

- Verify API key is set correctly
- Check API quota and billing
- Review console logs for specific error messages

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
