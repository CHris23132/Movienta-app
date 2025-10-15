import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">Movienta</div>
          <div className="flex items-center gap-6">
            <a href="#services" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Services
            </a>
            <a href="#about" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Contact
            </a>
            <Link href="/admin" className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Admin Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              AI Voice Agent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Made Easy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4">
              Create Your Own AI Receptionist Call Agent
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Simple web forms don&apos;t work anymore. This voice agent automatically collects the phone number to schedule a call 
              and then can provide information on your behalf based on your custom instructions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin" className="bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Get Started
              </Link>
              <a href="#features" className="border border-gray-300 dark:border-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Features</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Everything you need to turn your landing pages into lead-generating machines
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Custom Page</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your own custom styled landing page with your own branding. Match your company&apos;s look and feel perfectly.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Agent</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Simply type in English your instructions and the way you want your voice agent to act and talk. No code needed - have a voice agent perfectly fit to sell and support your business in minutes.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Book Calls</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Calls are automatically transcribed with the phone number captured and the call questions transcribed so you can pick up where your custom AI agent left off.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Easy Voice Agent - Affordable and Effective
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Don&apos;t waste your leads. Get more out of your leads rather than a simple webform or landing page. 
                Send your users to a live call with custom instructions and scripts as well as capture the phone number 
                right away so that your leads turn into calls and more deals closed.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Create your first AI voice agent in minutes. No credit card required to start.
            </p>
            <Link href="/signup" className="inline-block bg-foreground text-background px-10 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg">
              Get Started
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold mb-2">Movienta</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                AI Voice Agents Made Simple
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                © 2025 Movienta. All rights reserved.
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors">
                  Features
                </a>
                <Link href="/admin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
