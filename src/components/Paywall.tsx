'use client';

/**
 * ============================================
 * PAYWALL COMPONENT - ARCHIVED FOR FREE MODE
 * ============================================
 * 
 * This component is currently configured for FREE MODE.
 * All subscription/payment checks are bypassed, allowing
 * full access to the app without payment.
 * 
 * All original subscription/credit checking code is preserved
 * in comments for easy re-enablement in the future.
 * 
 * TO RE-ENABLE SUBSCRIPTIONS:
 * 1. Uncomment the archived code sections marked with "ARCHIVED"
 * 2. Remove or comment out the "FREE MODE" sections
 * 3. Restore the Paywall wrapper in admin/page.tsx
 * 
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PaywallProps {
  children: React.ReactNode;
  onAccessGranted?: () => void;
}

interface CreditsSummary {
  credits: number;
  hasSubscription: boolean;
  subscriptionId?: string;
}

// Stripe Price IDs - should match your environment variables
const PRICE_MONTHLY_SUBSCRIPTION = 'price_1SI73dHEYmBmUXRrgSZHNK8D';
const PRICE_CREDIT_TOPUP = 'price_1SIIXyHEYmBmUXRrd6qPYKoJ';

export default function Paywall({ children, onAccessGranted }: PaywallProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creditsSummary, setCreditsSummary] = useState<CreditsSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // ARCHIVED: FREE MODE ENABLED
  // ============================================
  // Subscription/payment checks are temporarily disabled.
  // The app is now free to use. All subscription/credit code
  // remains intact below for future re-enablement.
  // To re-enable: Uncomment the checks below and restore
  // the access validation logic.
  // ============================================

  useEffect(() => {
    // ARCHIVED: Free mode - always grant access immediately
    // Original code commented out:
    // if (user) {
    //   fetchCreditsSummary();
    // }
    
    // Free mode: Grant access immediately
    if (user) {
      onAccessGranted?.();
      setLoading(false);
    }
  }, [user, onAccessGranted]);

  // ARCHIVED: Original credit check function (kept for future use)
  // const fetchCreditsSummary = async () => {
  //   if (!user) return;

  //   try {
  //     const token = await user.getIdToken();
  //     const response = await fetch('/api/credits/summary', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch credits');
  //     }

  //     const data = await response.json();
  //     setCreditsSummary(data);
      
  //     // Check if user has access
  //     if (data.hasSubscription || data.credits > 0) {
  //       onAccessGranted?.();
  //     }
  //   } catch (error) {
  //     console.error('Error fetching credits:', error);
  //     setError('Failed to load subscription status');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubscribe = async () => {
    if (!user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/checkout/monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: PRICE_MONTHLY_SUBSCRIPTION }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleTopUp = async () => {
    if (!user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/checkout/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: PRICE_CREDIT_TOPUP }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  // ARCHIVED: Free mode - skip loading and access checks
  // Original code commented out:
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
  //       <div className="text-center">
  //         <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
  //         <p className="mt-4 text-gray-600 dark:text-gray-400">Checking subscription status...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // ARCHIVED: Original access check (kept for future use)
  // if (creditsSummary && (creditsSummary.hasSubscription || creditsSummary.credits > 0)) {
  //   return <>{children}</>;
  // }

  // FREE MODE: Always show content (bypass paywall)
  if (!loading) {
    return <>{children}</>;
  }

  // Loading state (should rarely show in free mode)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // ARCHIVED: Original paywall display (kept for future use)
  // This entire section is commented out for free mode
  // To re-enable: Uncomment this return statement and comment out the free mode return above
  /*
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Subscribe to Continue
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose a plan to access your admin dashboard and create AI-powered landing pages
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Monthly Subscription */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-2 border-blue-500 p-8 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm font-semibold">
              RECOMMENDED
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Monthly Subscription</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$20</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Includes 500 credits per month
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Unlimited landing pages</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">AI-powered chatbot</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Voice call integration</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Custom branding</span>
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>

          {/* Credit Top-up */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Credit Top-up</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$20</span>
                <span className="text-gray-600 dark:text-gray-400">/1000 credits</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">One-time payment</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">1,000 API credits</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">No expiration</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Pay as you grow</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500 dark:text-gray-500">No subscription benefits</span>
              </li>
            </ul>

            <button
              onClick={handleTopUp}
              disabled={isProcessing}
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-300 dark:disabled:border-gray-700 disabled:text-gray-400 font-semibold py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Buy Credits'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-500">
          Secure payment powered by Stripe • Cancel anytime
        </p>
      </div>
    </div>
  );
  */
  
  // FREE MODE: This should never be reached, but added as fallback
  return <>{children}</>;
}

