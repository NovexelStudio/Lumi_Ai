'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider,
  UserCredential,
  Auth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential | void>;
  auth: Auth | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInstance] = useState<Auth | null>(auth);

  useEffect(() => {
    if (!authInstance) {
      setLoading(false);
      return;
    }

    // Set persistence for better handling
    setPersistence(authInstance, browserLocalPersistence).catch(console.error);

    // Listen for auth state changes with error handling
    const unsubscribe = onAuthStateChanged(
      authInstance,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    // Handle redirect result for mobile
    getRedirectResult(authInstance).catch((error) => {
      console.error("Redirect auth error:", error);
    });

    return () => unsubscribe();
  }, [authInstance]);

  const logout = async () => {
    try {
      if (authInstance) {
        await signOut(authInstance);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signInWithGoogle = async () => {
    if (!authInstance) return;
    
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    // Enhanced error handling
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        return await signInWithRedirect(authInstance, provider);
      } else {
        return await signInWithPopup(authInstance, provider);
      }
    } catch (error: any) {
      console.error('Sign in error:', error.code, error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      signInWithGoogle,
      auth: authInstance 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}