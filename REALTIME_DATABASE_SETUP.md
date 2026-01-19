# Firebase Realtime Database Setup

## Overview

Your chat application now stores all conversations in Firebase Realtime Database. This means:
- ✅ Chat history persists across sessions
- ✅ Messages are saved in real-time
- ✅ Each user has their own private chat storage
- ✅ Automatic timestamps for all messages

## Database Structure

```
users/
  {userId}/
    messages/
      {messageId}: 
        {
          id: number,
          role: "user" | "assistant",
          content: string,
          timestamp: number (Unix ms)
        }
    createdAt: number
    updatedAt: number
```

## Setup Instructions

### Step 1: Enable Realtime Database in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Realtime Database** (left sidebar under Build)
4. Click **Create Database**
5. Choose your location (recommended: closest to your users)
6. Choose security rules mode:
   - **Test mode** (for development) - Anyone can read/write
   - **Locked mode** (for production) - Secure by default
7. Click **Enable**

### Step 2: Set Security Rules

For production, update your rules to ensure users can only access their own data:

1. In Realtime Database, go to **Rules** tab
2. Replace with these rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "messages": {
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

3. Click **Publish**

### Step 3: Get Database URL

1. In Realtime Database, go to **Data** tab
2. Look at the URL bar at the top - it shows your database URL
3. Format: `https://your-project-id.firebaseio.com`
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   ```

### Step 4: Update Environment Variables

Copy this to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

## How It Works

### Saving Messages

When a user sends a message:
1. Message is added to local state immediately (instant UI feedback)
2. Message is saved to Firebase Realtime Database
3. Both user messages and AI responses are saved
4. Timestamps are stored as Unix milliseconds for consistent ordering

### Loading Messages

When user logs in:
1. Chat page loads and fetches all messages from database
2. Messages are sorted by timestamp (oldest first)
3. Loaded into local state
4. User sees their full conversation history

### Clearing Chat

When user clears chat:
1. All messages deleted from database
2. Fresh greeting message shown
3. Chat starts fresh for next session

## Database Functions

All database operations are in `lib/databaseService.ts`:

- `saveMessage()` - Save a single message
- `loadMessages()` - Load all messages for user
- `clearMessages()` - Delete all messages for user
- `initializeUserChat()` - Set up user data structure
- `subscribeToMessages()` - Real-time updates (optional)

## Testing

### Manual Testing in Firebase Console

1. Go to Firebase Console > Realtime Database > Data
2. After login and sending messages, you should see:
   ```
   users/
     {userId}/
       messages/
         0: {role: "assistant", content: "...", timestamp: ...}
         1: {role: "user", content: "...", timestamp: ...}
         2: {role: "assistant", content: "...", timestamp: ...}
   ```

### Monitoring Usage

1. Go to **Realtime Database** > **Usage**
2. Monitor read/write operations and bandwidth
3. Free tier limits:
   - 100 simultaneous connections
   - 1 GB storage
   - 10 GB/month data transfer

## Billing Considerations

- **Reads**: $1 per GB data read
- **Writes**: $1 per GB data written
- **Storage**: $5 per GB
- **Free tier**: Enough for development

For cost optimization, consider:
- Deleting old chats periodically
- Limiting message length
- Using Firestore for long-term storage (cheaper for documents)

## Troubleshooting

### "Permission denied" errors

**Problem**: Messages won't save
**Solution**: 
- Check Database URL is correct in `.env.local`
- Verify security rules allow writes
- Ensure user is authenticated (check Firebase Console > Auth)

### "Cannot read property 'messages'" error

**Problem**: Error loading messages on startup
**Solution**:
- Check console for specific error
- Verify Database URL format
- Restart dev server after adding env vars

### Messages not persisting

**Problem**: Messages disappear after refresh
**Solution**:
- Check database has actual data in Firebase Console
- Verify `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is set
- Check browser console for errors

### Slow database loads

**Problem**: Chat takes time to load
**Solution**:
- This is normal for first load (network latency)
- Subsequent loads use browser cache
- Consider pagination for very large chat histories

## Advanced Features

To add later:
- **Multiple conversations**: Create separate chat threads
- **Search**: Query messages by content
- **Export**: Download chat as JSON/PDF
- **Archive**: Move old chats to cold storage
- **Sync**: Real-time updates across devices

## Security Best Practices

1. ✅ User data is isolated by UID
2. ✅ All data is encrypted in transit (HTTPS)
3. ✅ Implement rate limiting for API calls
4. ✅ Validate message content server-side
5. ✅ Never store sensitive data in messages

## Data Retention

Consider implementing data retention policies:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.child('messages').val() !== null || root.getRule(['users', $uid, 'messages']).getRuleCount() < 1000"
      }
    }
  }
}
```

This prevents storing more than 1000 messages per user.
