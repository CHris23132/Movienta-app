'use client';

import Link from 'next/link';
import Image from 'next/image';
import TypeWriter from '@/components/TypeWriter';

function DriveVideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full" aria-label={title}>
      {/* 16:9 responsive wrapper */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={src}
          title={title}
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
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header/Navigation */}
      <header className="w-full border-b border-white/20 backdrop-blur-sm bg-gradient-to-b from-white/5 to-transparent">
        <nav className="w-full px-8 sm:px-12 lg:px-20 xl:px-32 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Movienta</div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
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
        <section className="w-full px-8 sm:px-12 lg:px-20 xl:px-32 py-20 md:py-32 lg:py-40">
          <div className="text-center max-w-6xl mx-auto">
            <a 
              href="https://www.movienta.com/movienta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-full text-base font-bold mb-6 hover:shadow-2xl hover:scale-110 transition-all animate-pulse hover:animate-none shadow-lg"
              style={{ color: '#a5b4fc' }}
            >
              Try Demo Now
            </a>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight flex flex-col items-center text-white">
              <span>Create Voice</span>
              <span className="flex items-center gap-3">
                <span>Agents For</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  <TypeWriter 
                    words={['Leads', 'Sales', 'Support']}
                    className="inline-block"
                  />
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Launch Your AI Voice Agent in 5 Minutes
            </p>
            <p className="text-lg mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Your visitors want to <strong>talk</strong>, not type. Our AI voice agent captures phone numbers instantly, 
              qualifies leads automatically, and books calls 24/7 - while you focus on closing deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/admin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                Start Free Now <span className="text-2xl">→</span>
              </Link>
              <Link href="/signup" className="border-2 border-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                See How It Works
              </Link>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              🚀 No credit card required • ⚡ Set up in minutes • 📞 Unlimited customization
            </p>

            {/* How to Use Section */}
            <div className="mt-32 mb-24">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-20 text-center text-white">
                How to Use Movienta AI Agents
              </h2>

              <div className="grid md:grid-cols-2 gap-10 lg:gap-16 w-full">
                {/* Option 1: Embedded Code */}
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border-2 border-white/20 shadow-xl hover:border-white/30 transition-all">
                    <div className="flex items-start gap-5 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-lg">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white">
                          Add the Movienta Agent to your existing website (Preferred)
                        </h3>
                        <p className="text-sm lg:text-base" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Simple embedded code snippet works on any website builder including Shopify, Wix, WordPress, Squarespace and custom built websites
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-3xl transition-shadow">
                    <Image
                      src="/images/Embeded-eg.png"
                      alt="Embedded AI agent example on website"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </div>

                {/* Option 2: Hosted Landing Page */}
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border-2 border-white/20 shadow-xl hover:border-white/30 transition-all">
                    <div className="flex items-start gap-5 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-lg">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white">
                          Send traffic to a landing page we host for you
                        </h3>
                        <p className="text-sm lg:text-base" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Get a beautiful, branded landing page hosted on our platform with your custom AI voice agent. Send traffic to this hosted custom configured landing page and convert clicks into high quality leads.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-3xl transition-shadow">
                    <Image
                      src="/images/hosted-page.png"
                      alt="Hosted landing page example"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Subtitle */}
              <div className="mt-20 text-center w-full">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 lg:p-12 border border-white/20 shadow-xl max-w-5xl mx-auto">
                  <p className="text-lg md:text-xl lg:text-2xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    When you sign up for Movienta, setting up an AI agent is as easy as making a Facebook post. You get both the <strong>embedded code</strong> for your custom agent as well as the <strong>custom landing page</strong> we host for you.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Demo Videos */}
            <div className="mt-32">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-20 text-center text-white">
                See a full product demo
              </h2>
              
              <div className="grid md:grid-cols-2 gap-10 lg:gap-16 w-full">
                {/* Landing Page Demo */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-center text-white">
                    Demo For The Landing Page Hosted For You
                  </h3>
                  <DriveVideoEmbed 
                    src="https://drive.google.com/file/d/1zu9-Q7uK_bWZfALB0-Zc8INsGbd-JmlX/preview"
                    title="Landing Page Demo"
                  />
                </div>

                {/* Embedded Agent Demo */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-center text-white">
                    Demo For The Embedded AI Agent For Your Current Website
                  </h3>
                  <DriveVideoEmbed 
                    src="https://drive.google.com/file/d/1lLBEsJlQgFv0O4a4YgetSJvCxVeKkw8F/preview"
                    title="Embedded Agent Demo"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 lg:py-40">
          <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 text-white">Why Businesses Choose Movienta</h2>
            <p className="text-center text-xl lg:text-2xl mb-24 max-w-4xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Transform every visitor into a qualified lead with intelligent voice conversations
            </p>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 w-full">
              <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Your Brand, Your Way</h3>
                <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Create stunning, branded landing pages in minutes. No designer needed - just your vision brought to life with custom styling that converts.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">5-Minute Setup</h3>
                <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Just type your instructions in plain English. No coding. No complexity. Your AI agent learns your business and starts qualifying leads immediately.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Never Miss a Lead</h3>
                <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Auto-capture phone numbers, transcribe conversations, and qualify leads 24/7. Get detailed transcripts so you can close deals faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-32 lg:py-40">
          <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 leading-tight text-white">
                The Problem with Traditional Lead Capture
              </h2>
              <div className="h-1 w-40 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-24 w-full max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border-2 border-white/20 hover:border-red-400/30 transition-all hover:shadow-xl">
                <div className="text-5xl mb-6">❌</div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-white">Web Forms</h3>
                <ul className="space-y-4 text-lg" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <li className="flex gap-3"><span className="text-red-400 text-xl">•</span> <span>95% of visitors leave without converting</span></li>
                  <li className="flex gap-3"><span className="text-red-400 text-xl">•</span> <span>Leads are cold and unqualified</span></li>
                  <li className="flex gap-3"><span className="text-red-400 text-xl">•</span> <span>No personal connection or engagement</span></li>
                  <li className="flex gap-3"><span className="text-red-400 text-xl">•</span> <span>Hours spent on follow-up calls</span></li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border-2 border-white/20 hover:border-green-400/30 transition-all hover:shadow-xl">
                <div className="text-5xl mb-6">✅</div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-white">Movienta AI</h3>
                <ul className="space-y-4 text-lg" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <li className="flex gap-3"><span className="text-green-400 text-xl">•</span> <span>5x higher conversion rates</span></li>
                  <li className="flex gap-3"><span className="text-green-400 text-xl">•</span> <span>Pre-qualified, ready-to-buy leads</span></li>
                  <li className="flex gap-3"><span className="text-green-400 text-xl">•</span> <span>Human-like voice conversations</span></li>
                  <li className="flex gap-3"><span className="text-green-400 text-xl">•</span> <span>Close deals faster with less effort</span></li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold mb-8 text-white">
                Stop losing 95% of your traffic. Start converting today.
              </p>
              <Link href="/admin" className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all">
                Get Started Free <span className="text-3xl">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 lg:py-40 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32 text-center relative z-10">
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
      <footer className="border-t border-white/20 py-20 lg:py-24">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
              <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold mb-4 text-white">Movienta</div>
              <p className="mb-6 text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
                <a href="#features" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Features
                </a>
                <Link href="/admin" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Dashboard
                </Link>
                <Link href="/signup" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
              <div className="flex flex-col gap-3">
                <Link href="/login" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Sign In
                </Link>
                <a href="#" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Privacy Policy
                </a>
                <a href="#" className="transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              © 2025 Movienta. All rights reserved. Built for businesses that want to convert more leads.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
