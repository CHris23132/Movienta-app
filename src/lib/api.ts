// Helper function to make authenticated API calls
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the current user's UID from Firebase Auth
  const { auth } = await import('./firebase');
  const user = auth.currentUser;
  
  if (user) {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${user.uid}`);
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
  
  return fetch(url, options);
}

