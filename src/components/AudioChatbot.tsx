'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioChatbotProps {
  landingPageSlug: string;
  landingPageId: string;
  openingMessage: string;
}

export default function AudioChatbot({ landingPageSlug, landingPageId, openingMessage }: AudioChatbotProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize call and play opening message
  const startConversation = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create call
      const callResponse = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landingPageId, openingMessage }),
      });

      if (!callResponse.ok) throw new Error('Failed to start call');
      
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
        {/* Chat Messages */}
        <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 && !hasStarted && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-2">👋 Ready to chat?</p>
              <p className="text-sm">Click the button below to start a voice conversation</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {!hasStarted ? (
            <button
              onClick={startConversation}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {isProcessing ? 'Starting...' : 'Start Conversation'}
            </button>
          ) : (
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed shadow-lg ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-gray-400`}
              >
                {isRecording ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="8" y="8" width="8" height="8" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                )}
              </button>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRecording ? 'Click to stop recording' : 'Click to speak'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

