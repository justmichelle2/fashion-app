import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * ============================================
 * CHAT & MESSAGING SERVICE
 * Real-time messaging between users
 * ============================================
 */

/**
 * CREATE CONVERSATION
 * Initializes a new conversation between two users
 */
export const createConversation = async (user1Id, user2Id, user1Name, user2Name) => {
  try {
    if (!user1Id || !user2Id) {
      throw new Error("Both user IDs are required");
    }

    // Sort IDs to ensure unique conversation ID
    const [sortedUser1, sortedUser2] = [user1Id, user2Id].sort();
    const conversationId = `${sortedUser1}_${sortedUser2}`;

    // Check if conversation already exists
    const conversationRef = doc(db, "conversations", conversationId);
    const existingDoc = await getDoc(conversationRef);

    if (existingDoc.exists()) {
      return { success: true, conversationId, isNew: false };
    }

    // Create new conversation with conversationId as the document ID
    const conversationData = {
      conversationId,
      participants: [user1Id, user2Id],
      participantNames: {
        [user1Id]: user1Name,
        [user2Id]: user2Name,
      },
      lastMessage: null,
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(conversationRef, conversationData);

    return {
      success: true,
      conversationId,
      isNew: true,
    };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { success: false, error: error.message };
  }
};

/**
 * SEND MESSAGE
 * Sends a message in a conversation
 */
export const sendMessage = async (conversationId, senderId, senderName, text, attachments = []) => {
  try {
    if (!conversationId || !senderId || !text) {
      throw new Error("conversationId, senderId, and text are required");
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    const messageData = {
      senderId,
      senderName,
      text,
      attachments: attachments || [], // Array of { type, url, fileName }
      createdAt: serverTimestamp(),
      read: false,
    };

    const docRef = await addDoc(messagesRef, messageData);

    // Update conversation's lastMessage
    const conversationRef = doc(db, "conversations", conversationId);
    
    try {
      // Try to update existing conversation
      await updateDoc(conversationRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      // If conversation doesn't exist, create it
      if (err.code === "not-found") {
        console.warn("Conversation not found, attempting to create it");
        // Note: This is a fallback. In normal flow, conversation should exist
        // This handles edge cases where conversation was deleted or never created
        return { success: false, error: "Conversation not found. Please start a new conversation." };
      }
      throw err;
    }

    return {
      success: true,
      messageId: docRef.id,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET CONVERSATION MESSAGES
 * Fetches all messages in a conversation
 */
export const getConversationMessages = async (conversationId, limit = 50) => {
  try {
    if (!conversationId) {
      throw new Error("conversationId is required");
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    const messages = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .reverse(); // Reverse to show oldest first

    return {
      success: true,
      messages,
      total: messages.length,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: error.message };
  }
};

/**
 * SUBSCRIBE TO MESSAGES (REAL-TIME)
 * Real-time listener for new messages in a conversation
 * Returns unsubscribe function
 */
export const subscribeToMessages = (conversationId, callback) => {
  try {
    if (!conversationId) {
      throw new Error("conversationId is required");
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback({
        success: true,
        messages,
      });
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to messages:", error);
    callback({
      success: false,
      error: error.message,
    });
    return null;
  }
};

/**
 * GET USER CONVERSATIONS
 * Fetches all conversations for a user
 */
export const getUserConversations = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const conversationsRef = collection(db, "conversations");
    const q = query(conversationsRef, orderBy("updatedAt", "desc"));

    const snapshot = await getDocs(q);
    const conversations = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((conversation) => {
        const participantIds = conversation.participantIds || [];
        const participants = conversation.participants || {};

        if (Array.isArray(participantIds) && participantIds.includes(userId)) {
          return true;
        }

        return Boolean(participants?.[userId]);
      });

    return {
      success: true,
      conversations,
      total: conversations.length,
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { success: false, error: error.message };
  }
};

/**
 * MARK MESSAGES AS READ
 * Updates read status for messages
 */
export const markMessagesAsRead = async (conversationId, messageIds) => {
  try {
    if (!conversationId || !messageIds || messageIds.length === 0) {
      throw new Error("conversationId and messageIds are required");
    }

    const messagesRef = collection(db, "conversations", conversationId, "messages");

    const updatePromises = messageIds.map((messageId) => {
      const messageRef = doc(messagesRef, messageId);
      return updateDoc(messageRef, { read: true });
    });

    await Promise.all(updatePromises);

    return { success: true, message: "Messages marked as read" };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, error: error.message };
  }
};

/**
 * SEARCH CONVERSATIONS
 * Searches conversations by participant name or last message
 */
export const searchConversations = async (userId, searchTerm) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const conversationsResult = await getUserConversations(userId);
    if (!conversationsResult.success) {
      return conversationsResult;
    }

    const allConversations = conversationsResult.conversations || [];

    // Filter by search term (case-insensitive)
    const filtered = allConversations.filter((conv) => {
      const otherUserId = Object.keys(conv.participants).find((id) => id !== userId);
      const otherUser = conv.participants[otherUserId];
      const matchesName = otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMessage = conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesName || matchesMessage;
    });

    return {
      success: true,
      conversations: filtered,
      total: filtered.length,
    };
  } catch (error) {
    console.error("Error searching conversations:", error);
    return { success: false, error: error.message };
  }
};

/**
 * DELETE CONVERSATION
 * Deletes a conversation and all its messages
 * (Soft delete - archive instead of true delete)
 */
export const archiveConversation = async (conversationId) => {
  try {
    if (!conversationId) {
      throw new Error("conversationId is required");
    }

    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      archived: true,
      archivedAt: serverTimestamp(),
    });

    return { success: true, message: "Conversation archived" };
  } catch (error) {
    console.error("Error archiving conversation:", error);
    return { success: false, error: error.message };
  }
};

/**
 * FIRESTORE COLLECTIONS STRUCTURE
 *
 * conversations/
 *   {conversationId}/
 *     conversationId: string
 *     participants: {
 *       {userId1}: { name: string, id: string },
 *       {userId2}: { name: string, id: string }
 *     }
 *     lastMessage: string
 *     lastMessageTime: timestamp
 *     archived: boolean
 *     createdAt: timestamp
 *     updatedAt: timestamp
 *
 *     messages/ (subcollection)
 *       {messageId}/
 *         senderId: string
 *         senderName: string
 *         text: string
 *         attachments: [{ type, url, fileName }]
 *         read: boolean
 *         createdAt: timestamp
 */
