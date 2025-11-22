'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface CreditsSummary {
  credits: number;
  hasSubscription: boolean;
  subscriptionId?: string;
}

export default function CreditsBanner() {
  const { user } = useAuth();
  const [creditsSummary, setCreditsSummary] = useState<CreditsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCreditsSummary = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/credits/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCreditsSummary(data);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreditsSummary();
      // Refresh every 30 seconds
      const interval = setInterval(fetchCreditsSummary, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user || loading) {
    return null;
  }

  const getStatusColor = () => {
    if (creditsSummary?.hasSubscription) {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
    }
    if (creditsSummary && creditsSummary.credits > 20) {
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400';
    }
    if (creditsSummary && creditsSummary.credits > 0) {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400';
    }
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400';
  };

  return (
    <div className={`mb-6 p-4 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {creditsSummary?.hasSubscription ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-semibold">Active Subscription</span>
                <span className="mx-2">•</span>
                <span>{creditsSummary.credits} credits remaining</span>
              </div>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-semibold">
                  {creditsSummary && creditsSummary.credits > 0 
                    ? `${creditsSummary.credits} credits remaining` 
                    : 'No credits remaining'}
                </span>
                {creditsSummary && creditsSummary.credits > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-sm">No active subscription</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        
        <Link
          href="/credits"
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-current rounded-lg font-medium hover:bg-opacity-50 transition-colors text-sm"
        >
          {creditsSummary?.hasSubscription ? 'Manage' : 'Add Credits'}
        </Link>
      </div>
    </div>
  );
}

