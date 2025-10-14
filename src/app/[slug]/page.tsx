import { getLandingPageBySlug } from '@/lib/db';
import AudioChatbot from '@/components/AudioChatbot';
import { notFound } from 'next/navigation';

// Opening message that will be spoken first
const OPENING_MESSAGE = "Hello! I know you'd probably rather speak to a live sales representative, so can I please get your phone number? You can expect a call in the next couple of minutes.";

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landingPage = await getLandingPageBySlug(slug);

  if (!landingPage) {
    notFound();
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        '--theme-color': landingPage.themeColor || '#3B82F6',
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="text-2xl font-bold" style={{ color: landingPage.themeColor }}>
            {landingPage.brandName}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {landingPage.heroTitle}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              {landingPage.heroSubtitle}
            </p>
          </div>

          {/* Audio Chatbot */}
          <AudioChatbot
            landingPageSlug={landingPage.slug}
            landingPageId={landingPage.id}
            userId={landingPage.userId}
            openingMessage={OPENING_MESSAGE}
          />

          {/* Info Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Secure & Private Conversation</span>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Click the microphone to start a voice conversation. We&apos;ll gather your details<br />
              and connect you with a representative shortly.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 {landingPage.brandName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Generate static params for known landing pages (optional, for better performance)
export async function generateStaticParams() {
  // This will be empty initially, but you can populate it if needed
  return [];
}

