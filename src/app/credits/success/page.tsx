'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Optional: Verify the session with your backend
    if (sessionId) {
      console.log('Payment session completed:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Payment Successful!</h1>
          <p className="text-white/80 mb-8">
            Your payment has been processed successfully. Your credits will be available shortly.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <p className="text-sm text-white/80 mb-4">
            It may take a few moments for your credits to appear in your account.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/credits"
              className="w-full border border-white/20 font-semibold py-3 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              View Credits
            </Link>
          </div>
        </div>

        <p className="text-xs text-white/60">
          If you have any questions, please contact support.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

