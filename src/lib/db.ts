import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { LandingPage, Call, Message } from '@/types';

// Landing Pages
export const createLandingPage = async (data: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'landingPages'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getLandingPagesByUserId = async (userId: string): Promise<LandingPage[]> => {
  const q = query(collection(db, 'landingPages'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    } as LandingPage;
  });
};

export const getLandingPageBySlug = async (slug: string): Promise<LandingPage | null> => {
  const q = query(collection(db, 'landingPages'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  } as LandingPage;
};

export const getAllLandingPages = async (): Promise<LandingPage[]> => {
  const querySnapshot = await getDocs(collection(db, 'landingPages'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    } as LandingPage;
  });
};

export const updateLandingPage = async (id: string, data: Partial<LandingPage>) => {
  const docRef = doc(db, 'landingPages', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Calls
export const createCall = async (landingPageId: string, userId: string): Promise<string> => {
  try {
    console.log('[DB] Creating call for landing page:', landingPageId);
    const docRef = await addDoc(collection(db, 'calls'), {
      userId,
      landingPageId,
      messages: [],
      startedAt: serverTimestamp(),
      status: 'active',
    });
    console.log('[DB] Call created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[DB] Error creating call:', error);
    throw error;
  }
};

export const getCallsByUserId = async (userId: string): Promise<Call[]> => {
  const q = query(collection(db, 'calls'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startedAt: (data.startedAt as Timestamp)?.toDate() || new Date(),
      endedAt: data.endedAt ? (data.endedAt as Timestamp).toDate() : undefined,
    } as Call;
  });
};

export const updateCall = async (callId: string, data: Partial<Call>) => {
  const docRef = doc(db, 'calls', callId);
  await updateDoc(docRef, data);
};

export const addMessageToCall = async (callId: string, message: Omit<Message, 'timestamp'>) => {
  const docRef = doc(db, 'calls', callId);
  const callDoc = await getDoc(docRef);
  
  if (callDoc.exists()) {
    const currentMessages = callDoc.data().messages || [];
    await updateDoc(docRef, {
      messages: [
        ...currentMessages,
        {
          ...message,
          timestamp: new Date().toISOString(), // Use ISO string instead of serverTimestamp
        }
      ]
    });
  }
};

export const updateCallPhoneNumber = async (callId: string, phoneNumber: string) => {
  const docRef = doc(db, 'calls', callId);
  await updateDoc(docRef, {
    phoneNumber,
  });
};

export const updateCallClientInfo = async (callId: string, phoneNumber: string, clientName?: string) => {
  const docRef = doc(db, 'calls', callId);
  const updateData: { phoneNumber: string; clientName?: string } = { phoneNumber };
  if (clientName) {
    updateData.clientName = clientName;
  }
  await updateDoc(docRef, updateData);
};

export const getCall = async (callId: string): Promise<Call | null> => {
  const docRef = doc(db, 'calls', callId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    startedAt: (data.startedAt as Timestamp)?.toDate() || new Date(),
    endedAt: data.endedAt ? (data.endedAt as Timestamp).toDate() : undefined,
  } as Call;
};

export const getCallsByLandingPage = async (landingPageId: string): Promise<Call[]> => {
  const q = query(collection(db, 'calls'), where('landingPageId', '==', landingPageId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startedAt: (data.startedAt as Timestamp)?.toDate() || new Date(),
      endedAt: data.endedAt ? (data.endedAt as Timestamp).toDate() : undefined,
    } as Call;
  });
};

