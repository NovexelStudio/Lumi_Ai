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
  browserLocalPersistence,
  setPersistence,
  Auth
} from 'firebase/auth';
import { auth } from './firebase';
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const firebaseAuth = auth;
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    // 1. Set persistence immediately
    setPersistence(firebaseAuth, browserLocalPersistence).catch(console.error);

    // 2. The Redirect Handler (The Mobile Fix)
    const initAuth = async (activeAuth: Auth) => {
      try {
        // Attempt to catch the user coming back from Google
        const result = await getRedirectResult(activeAuth);
        if (result?.user) {
          setUser(result.user);
          // FORCE REDIRECT
          window.location.href = '/'; 
          return;
        }
      } catch (error: any) {
        console.error("Redirect Error:", error.code);
      }

      // 3. Auth State Observer
      onAuthStateChanged(activeAuth, (currentUser) => {
        setUser(currentUser);
        if (currentUser && pathname === '/auth') {
          router.replace('/');
        }
        setLoading(false);
      });
    };

    initAuth(firebaseAuth);
  }, [router, pathname]);

  const signInWithGoogle = async () => {
    const firebaseAuth = auth;
    if (!firebaseAuth) return;

    const provider = new GoogleAuthProvider();
    // Force account selection to prevent "auto-logging" into the wrong account
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Redirect is safer for mobile browsers
        await signInWithRedirect(firebaseAuth, provider);
      } else {
        await signInWithPopup(firebaseAuth, provider);
      }
    } catch (error: any) {
      console.error("Login Error:", error.code);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      router.push('/auth');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
