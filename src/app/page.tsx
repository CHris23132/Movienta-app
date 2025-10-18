import Link from 'next/link';

function DriveVideoEmbed() {
  const src = "https://drive.google.com/file/d/1zu9-Q7uK_bWZfALB0-Zc8INsGbd-JmlX/preview";

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12" aria-label="Product teaser video">
      {/* 16:9 responsive wrapper */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={src}
          title="Product teaser video"
          // Make the iframe fill the 16:9 box
          className="absolute inset-0 h-full w-full rounded-xl shadow-2xl"
          style={{ border: 0 }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Optional: text fallback for very old browsers or blocked iframes */}
      <noscript>
        <a href={src} target="_blank" rel="noopener noreferrer">
          Watch the video
        </a>
      </noscript>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">Movienta</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Sign In
            </Link>
            <Link href="/admin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">
              Start Now →
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6">
              ✨ Turn Link Clicks into Leads
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Stop Losing Leads
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Create AI Voice Agent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
              Launch Your AI Voice Agent in 5 Minutes
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Your visitors want to <strong>talk</strong>, not type. Our AI voice agent captures phone numbers instantly, 
              qualifies leads automatically, and books calls 24/7 - while you focus on closing deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/admin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                Start Free Now <span className="text-2xl">→</span>
              </Link>
              <Link href="/signup" className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
                See How It Works
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              🚀 No credit card required • ⚡ Set up in minutes • 📞 Unlimited customization
            </p>
            
            {/* Hero Video */}
            <h2 className="text-3xl md:text-4xl font-bold mt-16 mb-6">
              See a full product demo
            </h2>
            <DriveVideoEmbed />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Why Businesses Choose Movienta</h2>
            <p className="text-center text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
              Transform every visitor into a qualified lead with intelligent voice conversations
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Your Brand, Your Way</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Create stunning, branded landing pages in minutes. No designer needed - just your vision brought to life with custom styling that converts.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">5-Minute Setup</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Just type your instructions in plain English. No coding. No complexity. Your AI agent learns your business and starts qualifying leads immediately.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border-2 border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Never Miss a Lead</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Auto-capture phone numbers, transcribe conversations, and qualify leads 24/7. Get detailed transcripts so you can close deals faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                The Problem with Traditional Lead Capture
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-10"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-2xl border-2 border-red-200 dark:border-red-900/30">
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-400">Web Forms</h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3"><span className="text-red-500">•</span> <span>95% of visitors leave without converting</span></li>
                  <li className="flex gap-3"><span className="text-red-500">•</span> <span>Leads are cold and unqualified</span></li>
                  <li className="flex gap-3"><span className="text-red-500">•</span> <span>No personal connection or engagement</span></li>
                  <li className="flex gap-3"><span className="text-red-500">•</span> <span>Hours spent on follow-up calls</span></li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-8 rounded-2xl border-2 border-green-200 dark:border-green-900/30">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Movienta AI</h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3"><span className="text-green-500">•</span> <span>5x higher conversion rates</span></li>
                  <li className="flex gap-3"><span className="text-green-500">•</span> <span>Pre-qualified, ready-to-buy leads</span></li>
                  <li className="flex gap-3"><span className="text-green-500">•</span> <span>Human-like voice conversations</span></li>
                  <li className="flex gap-3"><span className="text-green-500">•</span> <span>Close deals faster with less effort</span></li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                Stop losing 95% of your traffic. Start converting today.
              </p>
              <Link href="/admin" className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all">
                Get Started Free <span className="text-3xl">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to 5x Your Lead Conversion?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              Join hundreds of businesses already using AI voice agents
            </p>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              Set up in 5 minutes • No credit card required • Cancel anytime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/admin" className="bg-white text-blue-600 px-12 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-3">
                Start Free Now <span className="text-2xl">→</span>
              </Link>
              <Link href="/signup" className="border-2 border-white text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-white/10 transition-all">
                Watch Demo
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No coding required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 lead capture</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold mb-4 text-white">Movienta</div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Transform your website visitors into qualified leads with AI-powered voice agents. 
                No coding required, set up in minutes.
              </p>
              <Link href="/admin" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Get Started Free →
              </Link>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Product</h3>
              <div className="flex flex-col gap-3">
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
              <div className="flex flex-col gap-3">
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Movienta. All rights reserved. Built for businesses that want to convert more leads.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
