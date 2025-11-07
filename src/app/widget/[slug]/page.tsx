import { getLandingPageBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import AudioChatbotWidget from '@/components/AudioChatbotWidget';

export default async function WidgetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landingPage = await getLandingPageBySlug(slug);

  if (!landingPage) {
    notFound();
  }

  const OPENING_MESSAGE = "Hello! I know you'd probably rather speak to a live sales representative, so can I please get your phone number? You can expect a call in the next couple of minutes.";

  return (
    <div className="fixed inset-0 bg-transparent">
      <AudioChatbotWidget
        landingPageSlug={landingPage.slug}
        landingPageId={landingPage.id}
        userId={landingPage.userId}
        openingMessage={OPENING_MESSAGE}
        brandName={landingPage.brandName}
        themeColor={landingPage.themeColor || '#3B82F6'}
        logoUrl={landingPage.logoUrl}
      />
    </div>
  );
}

