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
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

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
      // Auto-select first call if available
      if (sortedCalls.length > 0 && !selectedCall) {
        setSelectedCall(sortedCalls[0]);
      }
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

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get preview of last message
  const getMessagePreview = (call: Call) => {
    if (call.messages.length === 0) return 'No messages yet';
    const lastMsg = call.messages[call.messages.length - 1];
    return lastMsg.content.slice(0, 50) + (lastMsg.content.length > 50 ? '...' : '');
  };

  // Format date
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter calls based on search
  const filteredCalls = calls.filter(call => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      call.clientName?.toLowerCase().includes(searchLower) ||
      call.phoneNumber?.includes(searchTerm) ||
      call.messages.some(msg => msg.content.toLowerCase().includes(searchLower));
    
    return matchesSearch;
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative z-10">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0 border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Conversations</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 text-sm border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
            >
              ← Admin
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex-shrink-0 mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Conversations List */}
        <div className="w-80 border-r border-white/20 bg-white/10 backdrop-blur-sm flex flex-col min-h-0">
          {/* Filters */}
          <div className="flex-shrink-0 p-4 border-b border-white/20">
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  filter === 'all' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  filter === 'unread' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Unread
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg text-sm bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="mt-3 text-xs text-white/60 uppercase font-semibold">
              {filteredCalls.length} Results
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="inline-block w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-white/70 text-sm">
                  {calls.length === 0 ? 'No calls yet' : 'No matching conversations'}
                </p>
              </div>
            ) : (
              <div>
                {filteredCalls.map((call) => (
                  <button
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`w-full p-4 border-b border-white/20 hover:bg-white/10 transition-colors text-left ${
                      selectedCall?.id === call.id ? 'bg-blue-900/30 border-l-4 border-l-blue-400' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(call.clientName)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm text-white truncate">
                            {call.clientName || 'Unknown'}
                          </h3>
                          <span className="text-xs text-white/60 ml-2 flex-shrink-0">
                            {formatDate(call.startedAt)}
                          </span>
                        </div>
                        {call.phoneNumber && (
                          <p className="text-xs text-white/70 mb-1">
                            {call.phoneNumber}
                          </p>
                        )}
                        <p className="text-xs text-white/60 truncate">
                          {getMessagePreview(call)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            call.status === 'active' ? 'bg-green-400' : 'bg-white/40'
                          }`}></span>
                          <span className="text-xs text-white/60">
                            {call.messages.length} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Conversation Details */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 min-w-0">
          {selectedCall ? (
            <>
              {/* Conversation Header */}
              <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {getInitials(selectedCall.clientName)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedCall.clientName || 'Unknown Contact'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedCall.phoneNumber || 'No phone number'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      selectedCall.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    }`}>
                      {selectedCall.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {/* Conversation Start Indicator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    Conversation began {new Date(selectedCall.startedAt).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  {selectedCall.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {msg.role === 'user' ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                              {getInitials(selectedCall.clientName)}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs">
                              🤖
                            </div>
                          )}
                        </div>
                        
                        {/* Message Bubble */}
                        <div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-white'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                          <div className={`mt-1 text-xs text-white/50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {typeof msg.timestamp === 'string' 
                              ? new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                              : msg.timestamp?.toLocaleTimeString ? msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* End indicator if call ended */}
                {selectedCall.endedAt && (
                  <div className="flex items-center justify-center mt-6">
                    <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                      Conversation ended {new Date(selectedCall.endedAt).toLocaleDateString('en-US', { 
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-3">
                <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Messages:</span> {selectedCall.messages.length}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>{' '}
                    {selectedCall.endedAt 
                      ? `${Math.round((new Date(selectedCall.endedAt).getTime() - new Date(selectedCall.startedAt).getTime()) / 60000)} min`
                      : 'Ongoing'
                    }
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium mb-1">No conversation selected</p>
                <p className="text-sm">Select a conversation from the list to view details</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Contact Info */}
        {selectedCall && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              {/* Profile Section */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                  {getInitials(selectedCall.clientName)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {selectedCall.clientName || 'Unknown'}
                </h3>
                <div className="flex justify-center gap-3 mt-3">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Contact</h4>
                  
                  {selectedCall.phoneNumber && (
                    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {selectedCall.phoneNumber}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Status</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        selectedCall.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">
                        {selectedCall.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Activity</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-gray-600 dark:text-gray-400">First Contact</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {new Date(selectedCall.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {selectedCall.endedAt && (
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Last Activity</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {new Date(selectedCall.endedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

