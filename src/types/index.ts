// Database Types

export interface LandingPage {
  id: string;
  slug: string; // Unique URL slug based on brand name
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  customPrompt: string; // Instructions for the AI chatbot
  themeColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Call {
  id: string;
  landingPageId: string;
  phoneNumber?: string;
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed';
}

export interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface ConversationState {
  hasPhoneNumber: boolean;
  phoneNumber?: string;
  currentStep: 'greeting' | 'phone_collection' | 'follow_up' | 'completed';
}

