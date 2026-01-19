# Firebase Authentication Setup Guide

## What's Been Added

1. **Firebase Configuration** (`lib/firebase.ts`) - Firebase initialization and auth setup
2. **Auth Context** (`lib/authContext.tsx`) - Global authentication state management
3. **Login Page** (`app/auth/login/page.tsx`) - Email/password login page
4. **Signup Page** (`app/auth/signup/page.tsx`) - User registration page
5. **Protected Chat** - Main chat page now requires authentication
6. **Logout Button** - Added logout button to the header

## Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project" or select an existing one
3. Name your project (e.g., "Lumi AI")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Set Up Firebase Authentication
1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Select **Email/Password** authentication method
4. Enable it and click **Save**
5. Then enable **Google** as a sign-in provider:
   - Click **Google** in the provider list
   - Toggle the switch to **Enabled**
   - Select or create a support email
   - Click **Save**

### Step 3: Get Firebase Configuration
1. Go to **Project Settings** (gear icon in top-left)
2. Scroll to **Your apps** section
3. Click on the web app (or create one if needed)
4. Copy your Firebase config object

### Step 4: Add Environment Variables
1. Copy `.env.local.example` to `.env.local`
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Step 5: Install Dependencies
Firebase SDK is already installed. If needed, reinstall:
```bash
npm install firebase
```

### Step 6: Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to the login page.

## Features

### Authentication Flow
- **Email/Password Signup**: Create new account with email and password
- **Email/Password Login**: Sign in with existing credentials
- **Google Sign-In**: One-click authentication with Google account
- **Protected Routes**: Chat page requires authentication
- **Logout**: Button in header to sign out
- **Auto-redirect**: Non-authenticated users redirected to login

### Page Routes
- `/auth/signup` - Sign up page
- `/auth/login` - Login page
- `/` - Main chat page (protected)

## Usage

### First Time
1. Go to `http://localhost:3000`
2. You'll be redirected to `/auth/login`
3. Click "Sign up" link
4. Create account with email and password
5. You'll be automatically logged in and redirected to chat

### Subsequent Visits
1. Login with your credentials
2. Access the chat interface
3. Click logout icon (top-right) to sign out

## File Structure
```
lib/
  ├── firebase.ts                    # Firebase config & initialization
  └── authContext.tsx                # Auth provider & useAuth hook

components/
  └── GoogleSignInButton.tsx         # Reusable Google Sign-In button

app/
  ├── layout.tsx                     # Updated with AuthProvider
  ├── page.tsx                       # Updated with auth protection & logout
  └── auth/
      ├── login/page.tsx             # Login page (email/password + Google)
      └── signup/page.tsx            # Signup page (email/password + Google)
```

## Important Notes

⚠️ **Environment Variables**
- All `NEXT_PUBLIC_*` variables are safe to expose in frontend code
- Never commit `.env.local` to git - add it to `.gitignore`

⚠️ **Firebase Security Rules**
- By default, Firestore/Storage might be in development mode
- Before production, set up proper security rules in Firebase Console

⚠️ **Password Requirements**
- Minimum 6 characters (enforced by frontend)
- Firebase also enforces minimum length on backend

## Troubleshooting

### "Firebase is not initialized" error
- Check that `.env.local` has correct Firebase config values
- Ensure environment variables are loaded (restart dev server)

### "Cannot find module @/lib/firebase"
- Make sure `tsconfig.json` has `"@/*": ["*"]` path mapping (should be default in Next.js)

### Stuck on loading screen
- Check browser console for errors
- Verify Firebase credentials are correct

## Next Steps

1. Add email verification
2. Add password reset functionality
3. Store user profile data in Firestore
4. Sync chat history to Firestore per user
5. Add Google/GitHub OAuth authentication
