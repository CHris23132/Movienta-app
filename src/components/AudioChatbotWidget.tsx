'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface AudioChatbotWidgetProps {
  landingPageSlug: string;
  landingPageId: string;
  userId: string;
  openingMessage: string;
  brandName: string;
  themeColor: string;
  logoUrl?: string;
}

export default function AudioChatbotWidget({
  landingPageSlug,
  landingPageId,
  userId,
  openingMessage,
  brandName,
  themeColor,
  logoUrl,
}: AudioChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [callId, setCallId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize call and play opening message
  const startConversation = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create call
      const callResponse = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landingPageId, userId, openingMessage }),
      });

      if (!callResponse.ok) {
        const errorData = await callResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to start call');
      }
      
      const { callId: newCallId } = await callResponse.json();
      setCallId(newCallId);
      setMessages([{ role: 'assistant', content: openingMessage }]);

      // Play opening message
      await playAudio(openingMessage);
      
      setHasStarted(true);
      setIsProcessing(false);
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation. Please try again.');
      setIsProcessing(false);
    }
  };

  // Play audio using TTS
  const playAudio = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = reject;
        audio.play();
      });
    } catch (err) {
      console.error('Error playing audio:', err);
      throw err;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  // Process audio: transcribe, get AI response, play response
  const processAudio = async (audioBlob: Blob) => {
    try {
      if (!callId) {
        throw new Error('No active call');
      }

      // Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) throw new Error('Failed to transcribe audio');

      const { text: userMessage } = await transcribeResponse.json();
      
      // Add user message to UI
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      // Get AI response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          callId, 
          landingPageSlug 
        }),
      });

      if (!chatResponse.ok) throw new Error('Failed to get response');

      const { response: aiResponse } = await chatResponse.json();

      // Add AI response to UI
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Play AI response
      await playAudio(aiResponse);

      setIsProcessing(false);
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process your message. Please try again.');
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 animate-pulse hover:animate-none"
          style={{ backgroundColor: themeColor }}
          aria-label="Open chat"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ backgroundColor: themeColor }}
          >
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{brandName.charAt(0)}</span>
                </div>
              )}
              <div>
                <div className="font-semibold">{brandName}</div>
                <div className="text-xs opacity-90">AI Voice Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.length === 0 && !hasStarted && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-base mb-2">👋 Ready to chat?</p>
                <p className="text-sm">Click Start Conversation to begin</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                  style={message.role === 'user' ? { backgroundColor: themeColor } : {}}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="px-6 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Controls */}
          <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center gap-3">
              {!hasStarted ? (
                <button
                  onClick={startConversation}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {isProcessing ? 'Starting...' : 'Start Conversation'}
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'hover:scale-105'
                    }`}
                    style={!isRecording ? { backgroundColor: themeColor } : {}}
                  >
                    {isRecording ? (
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="8" y="8" width="8" height="8" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    )}
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {isRecording ? 'Click to stop recording' : 'Click to speak'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

