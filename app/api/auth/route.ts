import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, mode } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (mode === 'signup') {
      // Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return NextResponse.json(
        { 
          success: true, 
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
          }
        },
        { status: 201 }
      );
    } else {
      // Sign in existing user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return NextResponse.json(
        { 
          success: true, 
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
          }
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Auth error:', error);

    let errorMessage = 'Authentication failed';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already registered';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password must be at least 6 characters';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'Email not found';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}
