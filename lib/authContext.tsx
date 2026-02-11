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
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety check: If auth didn't initialize, stop the crash
    if (!auth) {
      console.warn("LUMI_OS: Auth not initialized. Check environment variables.");
      setLoading(false);
      return;
    }

    // 1. Set persistence
    setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence Error:", err));

    // 2. Catch the result of a redirect (Crucial for Mobile)
    getRedirectResult(auth)
      .then((result) => {
        if (result) setUser(result.user);
      })
      .catch((error) => console.error("Redirect Error:", error));

    // 3. Listen for auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Guard against null auth
    if (!auth) {
      throw new Error("auth/initialization-failed: Check your Firebase API Key.");
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      console.error("LUMI_OS AUTH_ERROR:", error.code);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};