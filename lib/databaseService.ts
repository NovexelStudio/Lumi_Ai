import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  onValue, 
  off,
  DatabaseReference 
} from 'firebase/database';
import { realtimeDb } from './firebase';

export interface ChatMessage {
  id: number;
  role: string;
  content: string;
  timestamp: number; // Unix timestamp for consistent ordering
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface UserChat {
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Get all chats for a user
 */
export async function getUserChats(userId: string): Promise<Chat[]> {
  try {
    if (!realtimeDb) {
      console.warn('Firebase database not initialized');
      return [];
    }
    const chatsRef = ref(realtimeDb, `users/${userId}/chats`);
    const snapshot = await get(chatsRef);

    if (snapshot.exists()) {
      const chatsData = snapshot.val();
      const chats: Chat[] = (Object.values(chatsData) as any[])
        .sort((a: any, b: any) => b.updatedAt - a.updatedAt);
      return chats;
    }

    return [];
  } catch (error) {
    console.error('Error loading chats:', error);
    return [];
  }
}

/**
 * Create a new chat
 */
export async function createChat(userId: string, title: string = 'New Chat'): Promise<string> {
  try {
    if (!realtimeDb) {
      throw new Error('Firebase database not initialized');
    }
    const chatId = Date.now().toString();
    const chatRef = ref(realtimeDb, `users/${userId}/chats/${chatId}`);
    
    await set(chatRef, {
      id: chatId,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
    });

    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

/**
 * Delete a chat
 */
export async function deleteChat(userId: string, chatId: string): Promise<void> {
  try {
    if (!realtimeDb) {
      throw new Error('Firebase database not initialized');
    }
    const chatRef = ref(realtimeDb, `users/${userId}/chats/${chatId}`);
    await remove(chatRef);
    
    // Also remove all messages in this chat
    const messagesRef = ref(realtimeDb, `users/${userId}/messages/${chatId}`);
    await remove(messagesRef);
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}

/**
 * Rename a chat
 */
export async function renameChat(userId: string, chatId: string, newTitle: string): Promise<void> {
  try {
    if (!realtimeDb) {
      throw new Error('Firebase database not initialized');
    }
    const chatRef = ref(realtimeDb, `users/${userId}/chats/${chatId}`);
    await update(chatRef, {
      title: newTitle,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error renaming chat:', error);
    throw error;
  }
}

/**
 * Save a single message to the database
 */
export async function saveMessage(userId: string, chatId: string, message: ChatMessage): Promise<void> {
  try {
    if (!realtimeDb) {
      throw new Error('Firebase database not initialized');
    }
    const messageRef = ref(realtimeDb, `users/${userId}/messages/${chatId}/${message.id}`);
    await set(messageRef, {
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      id: message.id,
    });

    // Update the chat's updatedAt timestamp and message count
    const chatRef = ref(realtimeDb, `users/${userId}/chats/${chatId}`);
    await update(chatRef, {
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

/**
 * Get all messages for a chat from the database
 */
export async function loadMessages(userId: string, chatId: string): Promise<ChatMessage[]> {
  try {
    if (!realtimeDb) {
      console.warn('Firebase database not initialized');
      return [];
    }
    const messagesRef = ref(realtimeDb, `users/${userId}/messages/${chatId}`);
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      // Convert object to array and sort by timestamp
      const messages: ChatMessage[] = (Object.values(messagesData) as any[])
        .sort((a: any, b: any) => a.timestamp - b.timestamp);
      return messages;
    }

    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

/**
 * Subscribe to real-time message updates
 */
export function subscribeToMessages(
  userId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  try {
    if (!realtimeDb) {
      console.warn('Firebase database not initialized');
      return () => {};
    }
    const messagesRef = ref(realtimeDb, `users/${userId}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val();
          const messages: ChatMessage[] = (Object.values(messagesData) as any[])
            .sort((a: any, b: any) => a.timestamp - b.timestamp);
          callback(messages);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error('Error subscribing to messages:', error);
      }
    );

    return () => off(messagesRef);
  } catch (error) {
    console.error('Error setting up subscription:', error);
    return () => {};
  }
}

/**
 * Clear all messages for a chat
 */
export async function clearMessages(userId: string, chatId: string): Promise<void> {
  try {
    if (!realtimeDb) {
      throw new Error('Firebase database not initialized');
    }
    const messagesRef = ref(realtimeDb, `users/${userId}/messages/${chatId}`);
    await remove(messagesRef);

    // Update the chat's updatedAt timestamp
    const chatRef = ref(realtimeDb, `users/${userId}/chats/${chatId}`);
    await update(chatRef, {
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error clearing messages:', error);
    throw error;
  }
}

/**
 * Initialize user (called on first load)
 */
export async function initializeUser(userId: string): Promise<void> {
  try {
    if (!realtimeDb) {
      console.warn('Firebase database not initialized');
      return;
    }
    const userRef = ref(realtimeDb, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        createdAt: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
}
