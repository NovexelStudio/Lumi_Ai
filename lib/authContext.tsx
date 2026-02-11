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
    // Narrow the type: Only run logic if auth is initialized (Client-side)
    if (auth) {
      // 1. Set persistence to keep user logged in across refreshes
      setPersistence(auth, browserLocalPersistence).catch(err => 
        console.error("LUMI_OS Persistence Error:", err)
      );

      // 2. Handle the Result after a Mobile Redirect
      const handleRedirectResult = async () => {
        try {
          const result = await getRedirectResult(auth);
          if (result?.user) {
            setUser(result.user);
            // If they are on the auth page, send them home
            if (pathname === '/auth') {
              router.replace('/');
            }
          }
        } catch (error: any) {
          console.error("LUMI_OS Redirect Error:", error.code);
        }
      };

      handleRedirectResult();

      // 3. Listen for Authentication State changes
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        
        // Auto-redirect if user is already authenticated
        if (currentUser && pathname === '/auth') {
          router.replace('/');
        }
        
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // If auth is undefined (Server-side/Build-time), stop loading state
      setLoading(false);
    }
  }, [router, pathname]);

  const signInWithGoogle = async () => {
    // Guard clause for TypeScript and Runtime safety
    if (!auth) {
      console.error("Authentication system not initialized.");
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      // Detect mobile device to switch from Popup to Redirect
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      console.error("LUMI_OS Auth Error:", error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
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