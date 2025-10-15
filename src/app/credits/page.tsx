'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CreditsSummary {
  credits: number;
  hasSubscription: boolean;
  subscriptionId?: string;
}

const PRICE_MONTHLY_SUBSCRIPTION = 'price_1SI73dHEYmBmUXRrgSZHNK8D';
const PRICE_CREDIT_TOPUP = 'price_1SIIXyHEYmBmUXRrd6qPYKoJ';

export default function CreditsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [creditsSummary, setCreditsSummary] = useState<CreditsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCreditsSummary();
    }
  }, [user]);

  const fetchCreditsSummary = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/credits/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();
      setCreditsSummary(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
      setError('Failed to load credits information');
    } finally {
      setLoading(false);
    }
  };

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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">Credits & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and credit balance
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Current Status */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Current Status</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Credits Balance</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {creditsSummary?.credits ?? 0}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Available credits
                </p>
              </div>

              <div className={`p-6 rounded-lg border ${
                creditsSummary?.hasSubscription
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <svg className={`w-6 h-6 ${
                    creditsSummary?.hasSubscription 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className={`text-lg font-semibold ${
                    creditsSummary?.hasSubscription 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>Subscription</h3>
                </div>
                <p className={`text-3xl font-bold ${
                  creditsSummary?.hasSubscription 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {creditsSummary?.hasSubscription ? 'Active' : 'Inactive'}
                </p>
                <p className={`text-sm mt-1 ${
                  creditsSummary?.hasSubscription 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {creditsSummary?.hasSubscription ? 'Monthly subscription' : 'No active subscription'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8">
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
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing || creditsSummary?.hasSubscription}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {creditsSummary?.hasSubscription 
                ? 'Already Subscribed' 
                : isProcessing ? 'Processing...' : 'Subscribe Now'}
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
      </div>
    </div>
  );
}

