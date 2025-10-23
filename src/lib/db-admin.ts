// Server-side database operations using Firebase Admin SDK
import { adminDb } from './firebase-admin';
import { LandingPage, Call } from '@/types';
import { FieldValue } from 'firebase-admin/firestore';

// Landing Pages
export const createLandingPage = async (data: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docData = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const docRef = await adminDb.collection('landingPages').add(docData);
  
  return docRef.id;
};

export const getLandingPagesByUserId = async (userId: string): Promise<LandingPage[]> => {
  const snapshot = await adminDb
    .collection('landingPages')
    .where('userId', '==', userId)
    .get();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as LandingPage;
  });
};

export const getLandingPageBySlug = async (slug: string): Promise<LandingPage | null> => {
  const snapshot = await adminDb
    .collection('landingPages')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  const data = doc.data();
  
  const landingPage = {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as LandingPage;
  
  return landingPage;
};

export const getAllLandingPages = async (): Promise<LandingPage[]> => {
  const snapshot = await adminDb.collection('landingPages').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as LandingPage;
  });
};

export const updateLandingPage = async (id: string, data: Partial<LandingPage>) => {
  await adminDb.collection('landingPages').doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
};

// Calls
export const createCall = async (landingPageId: string, userId: string): Promise<string> => {
  try {
    const docRef = await adminDb.collection('calls').add({
      userId,
      landingPageId,
      messages: [],
      startedAt: FieldValue.serverTimestamp(),
      status: 'active',
    });
    return docRef.id;
  } catch (error) {
    console.error('[DB Admin] Error creating call:', error);
    throw error;
  }
};

export const getCallsByUserId = async (userId: string): Promise<Call[]> => {
  const snapshot = await adminDb
    .collection('calls')
    .where('userId', '==', userId)
    .get();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startedAt: data.startedAt?.toDate() || new Date(),
      endedAt: data.endedAt ? data.endedAt.toDate() : undefined,
    } as Call;
  });
};

export const addMessageToCall = async (callId: string, message: { role: string; content: string }) => {
  const docRef = adminDb.collection('calls').doc(callId);
  const callDoc = await docRef.get();
  
  if (callDoc.exists) {
    const currentMessages = callDoc.data()?.messages || [];
    await docRef.update({
      messages: [
        ...currentMessages,
        {
          ...message,
          timestamp: new Date().toISOString(),
        }
      ]
    });
  }
};

