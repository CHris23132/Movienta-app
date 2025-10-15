// Firebase Admin SDK for server-side authentication verification
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  console.log('[Firebase Admin] Initializing...', {
    hasServiceAccount: !!serviceAccount,
    isPath: serviceAccount?.startsWith('/') || serviceAccount?.startsWith('./'),
  });
  
  if (serviceAccount) {
    // If it's a path to a file
    if (serviceAccount.startsWith('/') || serviceAccount.startsWith('./')) {
      console.log('[Firebase Admin] Using file path:', serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // If it's a JSON string
      try {
        const serviceAccountJSON = JSON.parse(serviceAccount);
        console.log('[Firebase Admin] Using JSON credentials, project:', serviceAccountJSON.project_id);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountJSON),
        });
      } catch (e) {
        console.error('[Firebase Admin] Error parsing service account JSON:', e);
        console.error('[Firebase Admin] First 100 chars:', serviceAccount.substring(0, 100));
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    }
  } else {
    console.log('[Firebase Admin] No service account found, using application default');
    // Fallback to application default credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  console.log('[Firebase Admin] Initialized successfully');
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

// Verify Firebase ID token and return user ID
export async function getUserFromToken(token: string): Promise<string | null> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Helper to get user ID from request headers
export async function getUserIdFromHeaders(headers: Headers): Promise<string | null> {
  const authHeader = headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract token and verify it
  const token = authHeader.replace('Bearer ', '');
  return await getUserFromToken(token);
}

