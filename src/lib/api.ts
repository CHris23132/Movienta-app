// Helper function to make authenticated API calls
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the current user from Firebase Auth
  const { auth } = await import('./firebase');
  const user = auth.currentUser;
  
  if (user) {
    // Get the Firebase ID token (JWT)
    const token = await user.getIdToken();
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
  
  return fetch(url, options);
}

