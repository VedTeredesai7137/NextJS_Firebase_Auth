import { initializeApp, getApps, getApp as getFirebaseApp, FirebaseError } from "firebase/app";
import { 
  getAuth as getFirebaseAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User,
  onAuthStateChanged,
  Auth
} from "firebase/auth";
import { getAnalytics as getFirebaseAnalytics, Analytics } from "firebase/analytics";
import { FirebaseApp } from "firebase/app";

// Lazy initialization variables
let _appInstance: FirebaseApp | null = null;
let _authInstance: Auth | null = null;
let _analyticsInstance: Analytics | null = null;

// Get Firebase config - only use in browser
const getFirebaseConfig = () => {
  // During build time, return a dummy config to prevent errors
  if (typeof window === "undefined") {
    return {
      apiKey: "dummy-key",
      authDomain: "dummy.firebaseapp.com",
      projectId: "dummy-project",
      storageBucket: "dummy.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:dummy",
      measurementId: "G-DUMMY"
    };
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error("Missing Firebase configuration. Please check your environment variables.");
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
};

// Initialize Firebase lazily - only on client side
const initializeFirebase = (): { app: FirebaseApp; auth: Auth; analytics: Analytics | null } => {
  // Only initialize in browser
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be initialized on the client side.");
  }

  // Return existing instances if already initialized
  if (_appInstance && _authInstance) {
    return { app: _appInstance, auth: _authInstance, analytics: _analyticsInstance };
  }

  const firebaseConfig = getFirebaseConfig();
  
  // Check if we're using dummy config (build time)
  if (firebaseConfig.apiKey === "dummy-key") {
    throw new Error("Firebase is not available during build time. This should only be called on the client.");
  }

  // Initialize Firebase only once
  _appInstance = !getApps().length ? initializeApp(firebaseConfig) : getFirebaseApp();
  _authInstance = getFirebaseAuth(_appInstance);
  _analyticsInstance = typeof window !== "undefined" ? getFirebaseAnalytics(_appInstance) : null;

  return { app: _appInstance, auth: _authInstance, analytics: _analyticsInstance };
};

// Get app instance (lazy initialization)
const getAppInstance = (): FirebaseApp => {
  if (!_appInstance) {
    const instance = initializeFirebase();
    _appInstance = instance.app;
  }
  return _appInstance;
};

// Get auth instance (lazy initialization)
const getAuthInstance = (): Auth => {
  if (!_authInstance) {
    const instance = initializeFirebase();
    _authInstance = instance.auth;
  }
  return _authInstance;
};

// Get analytics instance (lazy initialization)
const getAnalyticsInstance = (): Analytics | null => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!_analyticsInstance) {
    const instance = initializeFirebase();
    _analyticsInstance = instance.analytics;
  }
  return _analyticsInstance;
};

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
    const authInstance = getAuthInstance();
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const logoutUser = async () => {
  try {
    const authInstance = getAuthInstance();
    await signOut(authInstance);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Export getters that use lazy initialization
export const getApp = () => getAppInstance();
export const getAuth = () => getAuthInstance();
export const getAnalytics = () => getAnalyticsInstance();

// Export auth as a Proxy that lazily initializes Firebase
// This ensures Firebase is only initialized when actually used (client-side)
export const auth = new Proxy({} as Auth, {
  get(target, prop) {
    // During build/SSR, return a no-op function or undefined for methods
    if (typeof window === "undefined") {
      // Return a no-op function for methods to prevent errors during build
      if (typeof prop === "string" && prop !== "then" && prop !== "toJSON") {
        return () => {};
      }
      return undefined;
    }
    try {
      const authInstance = getAuthInstance();
      const value = authInstance[prop as keyof Auth];
      // If it's a function, bind it to the auth instance
      if (typeof value === "function") {
        return (value as Function).bind(authInstance);
      }
      return value;
    } catch (error) {
      // If initialization fails, return undefined or a no-op
      console.error("Firebase auth initialization error:", error);
      return undefined;
    }
  }
});

// Export app as a Proxy that lazily initializes Firebase
export const app = new Proxy({} as FirebaseApp, {
  get(target, prop) {
    // During build/SSR, return undefined or no-op
    if (typeof window === "undefined") {
      if (typeof prop === "string" && prop !== "then" && prop !== "toJSON") {
        return () => {};
      }
      return undefined;
    }
    try {
      const appInstance = getAppInstance();
      const value = appInstance[prop as keyof FirebaseApp];
      if (typeof value === "function") {
        return (value as Function).bind(appInstance);
      }
      return value;
    } catch (error) {
      console.error("Firebase app initialization error:", error);
      return undefined;
    }
  }
});

// Export analytics (will be null during SSR/build)
export const analytics = typeof window !== "undefined" ? getAnalyticsInstance() : null;

// Export other Firebase functions
export { onAuthStateChanged, type User };
