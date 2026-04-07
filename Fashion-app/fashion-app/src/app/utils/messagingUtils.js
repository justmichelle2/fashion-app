import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

/**
 * CHAT & MESSAGING SYSTEM
 */

// Create or get conversation between two users
export const getOrCreateConversation = async (otherUserId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    if (otherUserId === auth.currentUser.uid) {
      throw new Error("Cannot chat with yourself");
    }

    // Create a consistent conversation ID (smaller ID first)
    const ids = [auth.currentUser.uid, otherUserId].sort();
    const conversationId = `${ids[0]}_${ids[1]}`;

    const conversationRef = doc(db, "conversations", conversationId);
    let conversationDoc = await getDoc(conversationRef);

    if (!conversationDoc.exists()) {
      // Create new conversation
      const conversation = {
        conversationId,
        participants: [auth.currentUser.uid, otherUserId],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        lastMessageBy: null,
        updatedAt: serverTimestamp(),
      };

      await setDoc(conversationRef, conversation);
      return {
        success: true,
        conversationId,
        conversation,
        isNew: true,
      };
    }

    return {
      success: true,
      conversationId,
      conversation: conversationDoc.data(),
      isNew: false,
    };
  } catch (error) {
    console.error("Error creating/getting conversation:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get user's conversations
export const getUserConversations = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", auth.currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const result = await getDocs(q);
    const conversations = result.docs.map((doc) => ({
      conversationId: doc.id,
      ...doc.data(),
    }));

    // Get other user details for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participants.find(
          (id) => id !== auth.currentUser.uid
        );
        try {
          const otherUserRef = doc(db, "users", otherUserId);
          const otherUserDoc = await getDoc(otherUserRef);
          return {
            ...conv,
            otherUser: otherUserDoc.exists()
              ? {
                  userId: otherUserId,
                  ...otherUserDoc.data(),
                }
              : { userId: otherUserId },
          };
        } catch {
          return {
            ...conv,
            otherUser: { userId: otherUserId },
          };
        }
      })
    );

    return {
      success: true,
      conversations: conversationsWithUsers,
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send message
export const sendMessage = async (conversationId, content, type = "text") => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const message = {
      senderId: auth.currentUser.uid,
      content: content,
      type: type, // text, image, file, location
      status: "sent", // sent, delivered, read
      createdAt: serverTimestamp(),
      editedAt: null,
    };

    const docRef = await addDoc(messagesRef, message);

    // Update conversation's last message
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
      lastMessageBy: auth.currentUser.uid,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      messageId: docRef.id,
      message: {
        messageId: docRef.id,
        ...message,
      },
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get messages from conversation
export const getConversationMessages = async (conversationId, limit = 50) => {
  try {
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(
      messagesRef,
      orderBy("createdAt", "desc")
    );

    const result = await getDocs(q);
    const messages = result.docs
      .slice(0, limit)
      .map((doc) => ({
        messageId: doc.id,
        ...doc.data(),
      }))
      .reverse(); // Reverse to show oldest first

    return {
      success: true,
      messages,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(
      messagesRef,
      where("status", "==", "delivered"),
      where("senderId", "!=", auth.currentUser.uid)
    );

    const result = await getDocs(q);

    // Batch update to mark as read
    const updates = result.docs.map((doc) =>
      updateDoc(doc.ref, {
        status: "read",
      })
    );

    await Promise.all(updates);

    return {
      success: true,
      markedCount: updates.length,
    };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete message
export const deleteMessage = async (conversationId, messageId) => {
  try {
    const messageRef = doc(
      db,
      "conversations",
      conversationId,
      "messages",
      messageId
    );
    await updateDoc(messageRef, {
      content: "[Message deleted]",
      type: "deleted",
      editedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Edit message
export const editMessage = async (
  conversationId,
  messageId,
  newContent
) => {
  try {
    const messageRef = doc(
      db,
      "conversations",
      conversationId,
      "messages",
      messageId
    );
    await updateDoc(messageRef, {
      content: newContent,
      editedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error editing message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get unread message count
export const getUnreadMessageCount = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const convQuery = query(
      collection(db, "conversations"),
      where("participants", "array-contains", auth.currentUser.uid)
    );

    const convResult = await getDocs(convQuery);
    let totalUnread = 0;

    for (const convDoc of convResult.docs) {
      const messagesRef = collection(
        db,
        "conversations",
        convDoc.id,
        "messages"
      );
      const msgQuery = query(
        messagesRef,
        where("status", "==", "delivered"),
        where("senderId", "!=", auth.currentUser.uid)
      );

      const msgResult = await getDocs(msgQuery);
      totalUnread += msgResult.docs.length;
    }

    return {
      success: true,
      unreadCount: totalUnread,
    };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * CHAT NOTIFICATIONS & PREFERENCES
 */

// Save notification preferences
export const saveNotificationPreferences = async (preferences) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const prefRef = doc(db, "notificationPreferences", auth.currentUser.uid);
    const prefs = {
      userId: auth.currentUser.uid,
      messageNotifications: preferences.messageNotifications !== false,
      emailNotifications: preferences.emailNotifications !== false,
      pushNotifications: preferences.pushNotifications !== false,
      quietHours: preferences.quietHours || {
        enabled: false,
        startTime: "22:00",
        endTime: "08:00",
      },
      mutedConversations: preferences.mutedConversations || [],
      updatedAt: serverTimestamp(),
    };

    await setDoc(prefRef, prefs);

    return {
      success: true,
      preferences: prefs,
    };
  } catch (error) {
    console.error("Error saving notification preferences:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get notification preferences
export const getNotificationPreferences = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const prefRef = doc(db, "notificationPreferences", auth.currentUser.uid);
    const result = await getDoc(prefRef);

    if (!result.exists()) {
      // Return default preferences
      return {
        success: true,
        preferences: {
          messageNotifications: true,
          emailNotifications: true,
          pushNotifications: true,
          quietHours: {
            enabled: false,
            startTime: "22:00",
            endTime: "08:00",
          },
          mutedConversations: [],
        },
      };
    }

    return {
      success: true,
      preferences: result.data(),
    };
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Mute conversation
export const muteConversation = async (conversationId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const prefRef = doc(db, "notificationPreferences", auth.currentUser.uid);
    const prefDoc = await getDoc(prefRef);
    const currentMuted = prefDoc.exists()
      ? prefDoc.data().mutedConversations || []
      : [];

    if (!currentMuted.includes(conversationId)) {
      await updateDoc(prefRef, {
        mutedConversations: [...currentMuted, conversationId],
        updatedAt: serverTimestamp(),
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error muting conversation:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Unmute conversation
export const unmuteConversation = async (conversationId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const prefRef = doc(db, "notificationPreferences", auth.currentUser.uid);
    const prefDoc = await getDoc(prefRef);
    const currentMuted = prefDoc.exists()
      ? prefDoc.data().mutedConversations || []
      : [];

    await updateDoc(prefRef, {
      mutedConversations: currentMuted.filter((id) => id !== conversationId),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error unmuting conversation:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
