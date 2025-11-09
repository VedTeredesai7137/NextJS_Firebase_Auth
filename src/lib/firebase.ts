import { initializeApp, getApps, getApp, FirebaseError } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Error handling
export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists. Please try signing in instead.',
  'auth/weak-password': 'Password is too weak. Please choose a stronger password with at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-not-found': 'No account found with this email address. Please check your email or create a new account.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/user-disabled': 'This account has been disabled. Please contact support for assistance.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later or reset your password.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/timeout': 'Request timed out. Please try again.',
};

export const handleAuthError = (error: unknown): AuthError => {
  console.error('Auth error:', error);
  
  if (error instanceof FirebaseError) {
    const userFriendlyMessage = AUTH_ERROR_MESSAGES[error.code] || 
      'An unexpected error occurred. Please try again.';
    
    return {
      code: error.code,
      message: error.message,
      userFriendlyMessage,
    };
  }
  
  if (error instanceof Error) {
    return {
      code: 'unknown',
      message: error.message,
      userFriendlyMessage: 'An unexpected error occurred. Please try again.',
    };
  }
  
  return {
    code: 'unknown',
    message: 'Unknown error',
    userFriendlyMessage: 'An unexpected error occurred. Please try again.',
  };
};

// Validation functions
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  return null;
};

// Auth functions
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export { app, auth, analytics, onAuthStateChanged, type User };
