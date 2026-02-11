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
    // 1. Capture the auth instance in a local constant.
    // This 'locks' the type as 'Auth' so TypeScript stops complaining.
    const firebaseAuth = auth;

    if (firebaseAuth) {
      // 2. Set persistence
      setPersistence(firebaseAuth, browserLocalPersistence).catch(err => 
        console.error("LUMI_OS Persistence Error:", err)
      );

      // 3. Handle the Mobile Redirect Result
      const handleRedirect = async (activeAuth: Auth) => {
        try {
          const result = await getRedirectResult(activeAuth);
          if (result?.user) {
            setUser(result.user);
            if (pathname === '/auth') {
              router.replace('/');
            }
          }
        } catch (error: any) {
          console.error("LUMI_OS Redirect Handshake Error:", error.code);
        }
      };

      handleRedirect(firebaseAuth);

      // 4. Main Auth State Observer
      const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
        setUser(currentUser);
        if (currentUser && pathname === '/auth') {
          router.replace('/');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // If auth is undefined (during Vercel build), stop loading
      setLoading(false);
    }
  }, [router, pathname]);

  const signInWithGoogle = async () => {
    // Re-capture locally for the async function
    const firebaseAuth = auth;
    if (!firebaseAuth) {
      console.error("Authentication system not initialized.");
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Mobile redirect to bypass popup blockers
        await signInWithRedirect(firebaseAuth, provider);
      } else {
        // Desktop popup for better UX
        await signInWithPopup(firebaseAuth, provider);
      }
    } catch (error: any) {
      console.error("LUMI_OS Auth Error:", error.code);
      throw error;
    }
  };

  const logout = async () => {
    const firebaseAuth = auth;
    if (firebaseAuth) {
      try {
        await signOut(firebaseAuth);
        setUser(null);
        router.push('/auth');
      } catch (error) {
        console.error("Logout error:", error);
      }
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
