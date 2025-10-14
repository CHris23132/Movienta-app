'use client';

import { useState, useEffect } from 'react';
import { Call } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCallsByUserId } from '@/lib/db';

export default function CallsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCalls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCalls = async () => {
    if (!user) return;
    
    try {
      const userCalls = await getCallsByUserId(user.uid);
      // Sort by most recent first
      const sortedCalls = userCalls.sort((a, b) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
      setCalls(sortedCalls);
    } catch (error) {
      console.error('Error fetching calls:', error);
      setError('Failed to load calls');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Call Records</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all conversations from your landing pages
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Logged in as: {user.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              ← Back to Admin
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Calls List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading calls...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No calls yet. Share your landing pages to start receiving calls!
                </p>
                <Link
                  href="/admin"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Go to Admin Dashboard →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {calls.map((call) => (
                  <div
                    key={call.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {call.phoneNumber && (
                            <span className="text-lg font-semibold">
                              📞 {call.phoneNumber}
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            call.status === 'active' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          }`}>
                            {call.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Started: {new Date(call.startedAt).toLocaleString()}
                        </p>
                        {call.endedAt && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Ended: {new Date(call.endedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {call.messages.length} messages
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    {call.messages.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                        {call.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                                : 'bg-gray-50 dark:bg-gray-800 mr-8'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                                {msg.role === 'user' ? '👤 User' : '🤖 AI'}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-600">
                                {typeof msg.timestamp === 'string' 
                                  ? new Date(msg.timestamp).toLocaleTimeString()
                                  : msg.timestamp?.toLocaleTimeString ? msg.timestamp.toLocaleTimeString() : 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {calls.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Calls</p>
              <p className="text-3xl font-bold">{calls.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone Numbers Captured</p>
              <p className="text-3xl font-bold">
                {calls.filter(c => c.phoneNumber).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Messages</p>
              <p className="text-3xl font-bold">
                {calls.reduce((sum, call) => sum + call.messages.length, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

