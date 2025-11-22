import { getLandingPageBySlug } from '@/lib/db';
import AudioChatbot from '@/components/AudioChatbot';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Opening message that will be spoken first
const OPENING_MESSAGE = "Hello! I know you'd probably rather speak to a live sales representative, so can I please get your name and phone number? You can expect a call in the next couple of minutes.";

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landingPage = await getLandingPageBySlug(slug);

  if (!landingPage) {
    notFound();
  }


  return (
    <div 
      className="min-h-screen flex flex-col relative z-10"
      style={{
        '--theme-color': landingPage.themeColor || '#3B82F6',
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="w-full border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-3">
            {landingPage.logoUrl ? (
              <Image
                src={landingPage.logoUrl}
                alt={`${landingPage.brandName} logo`}
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
                priority
                unoptimized
              />
            ) : (
              <div className="h-10 w-10 bg-white/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {landingPage.brandName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="text-2xl font-bold text-white">
              {landingPage.brandName}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              {landingPage.heroTitle}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-white">Secure & Private Conversation</span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Click the microphone to start a voice conversation. We&apos;ll gather your details<br />
              and connect you with a representative shortly.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-white/70">
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

