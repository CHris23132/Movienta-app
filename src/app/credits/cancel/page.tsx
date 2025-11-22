'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Payment Cancelled</h1>
          <p className="text-white/80 mb-8">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <p className="text-sm text-white/80 mb-4">
            You can try again anytime or explore other options.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/credits"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              View Pricing
            </Link>
            <Link
              href="/admin"
              className="w-full border border-white/20 font-semibold py-3 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <p className="text-xs text-white/60">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
}

