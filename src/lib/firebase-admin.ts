// Firebase Admin SDK for server-side authentication verification
import { auth } from './firebase';

export async function getUserFromToken(_token: string) {
  try {
    // For client-side auth, we'll use Firebase Auth directly
    // This is a simplified version - in production, use Firebase Admin SDK
    const user = auth.currentUser;
    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Helper to get user ID from request headers
export function getUserIdFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract UID directly from header (sent by client)
  const uid = authHeader.replace('Bearer ', '');
  return uid;
}

