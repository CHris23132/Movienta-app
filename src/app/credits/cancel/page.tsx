'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
              className="w-full border border-gray-300 dark:border-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
}

