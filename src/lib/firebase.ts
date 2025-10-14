// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtr7FOGmKDuwNVVcQWZbeaTvGW1TTd0Y4",
  authDomain: "connect-now-16778.firebaseapp.com",
  projectId: "connect-now-16778",
  storageBucket: "connect-now-16778.firebasestorage.app",
  messagingSenderId: "954438888605",
  appId: "1:954438888605:web:a3ce39dc04f45f52eaf874",
  measurementId: "G-05JKBYJL19"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

