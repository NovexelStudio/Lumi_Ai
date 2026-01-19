# Google Authentication Troubleshooting

## "Protocol failure: Connection to Google rejected" Error

This error typically occurs when:

### 1. **Domain Not Authorized in Firebase Console**
Your deployment domain needs to be added to Firebase's authorized domains list.

**Steps to fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`lumiai-5b06f`)
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your domain:
   - Local: `localhost:3000`
   - Production: `lumi-ai.vercel.app`
   - Any other domains you use

### 2. **Check Google OAuth Consent Screen**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Ensure:
   - Consent screen is configured
   - Your app is in **Testing** mode (for development)
   - Add test users if needed

### 3. **Verify OAuth Client ID**
1. Go to **APIs & Services** → **Credentials**
2. Find your Web client ID
3. Ensure authorized redirect URIs include:
   - `http://localhost:3000`
   - `https://lumi-ai.vercel.app`

### 4. **Enable Google Sign-In API**
1. Go to **APIs & Services** → **Enabled APIs & services**
2. Search for "Google+ API"
3. If not enabled, click **Enable**

### 5. **Environment Variables**
Verify `.env.local` has all Firebase credentials (already configured):
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABWdS86-laClE8N7p_zeZgAkNCz5N7uNE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lumiai-5b06f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lumiai-5b06f
NEXT_PUBLIC_FIREBASE_APP_ID=1:598245446497:web:631d2b21add14004bcab20
```

### 6. **Test Locally First**
Run the development server:
```bash
npm run dev
```
Then test Google Sign-In at `http://localhost:3000/auth`

### Quick Checklist:
- [ ] Domain added to Firebase authorized domains
- [ ] OAuth consent screen configured
- [ ] Google+ API enabled
- [ ] Test users added (if app in Testing mode)
- [ ] Environment variables set
- [ ] Local testing successful before pushing to Vercel

## Still Not Working?
1. Check browser console (F12) for detailed error messages
2. Check Firebase Auth logs in the console
3. Clear browser cache and cookies
4. Try incognito/private mode
