import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * NOTIFICATIONS SERVICE
 * Manages in-app, push, and email notifications
 */

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: "order_confirmed",
  ORDER_STATUS_UPDATE: "order_status_update",
  PAYMENT_RECEIVED: "payment_received",
  MESSAGE_RECEIVED: "message_received",
  REVIEW_POSTED: "review_posted",
  DESIGNER_VERIFIED: "designer_verified",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  NEW_INQUIRY: "new_inquiry",
  MEASUREMENT_UPLOADED: "measurement_uploaded",
  ADMIN_ALERT: "admin_alert"
};

/**
 * Create a notification for a user
 * @param {Object} notificationData - Notification details
 * @param {string} notificationData.userId - User ID to notify
 * @param {string} notificationData.type - Notification type (from NOTIFICATION_TYPES)
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {string} notificationData.relatedId - ID of related entity (orderId, reviewId, etc)
 * @param {string} notificationData.relatedType - Type of related entity (order, review, booking, etc)
 * @param {Object} notificationData.data - Additional metadata
 * @returns {Promise<string>} Notification ID
 */
export async function createNotification(notificationData) {
  try {
    const {
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
      data,
      priority = "normal" // high, normal, low
    } = notificationData;

    const notificationsRef = collection(db, "notifications");
    
    const newNotification = await addDoc(notificationsRef, {
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
      data,
      priority,
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return newNotification.id;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
}

/**
 * Get user's notifications
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {boolean} options.unreadOnly - Only unread notifications
 * @param {number} options.pageLimit - Max results
 * @returns {Promise<Array>}
 */
export async function getUserNotifications(userId, options = {}) {
  const { unreadOnly = false, pageLimit = 20 } = options;

  try {
    const notificationsRef = collection(db, "notifications");
    const constraints = [where("userId", "==", userId)];

    if (unreadOnly) {
      constraints.push(where("read", "==", false));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(pageLimit));

    const q = query(notificationsRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export async function markAsRead(notificationId) {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    throw err;
  }
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function markAllAsRead(userId) {
  try {
    const batch = writeBatch(db);
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: serverTimestamp()
      });
    });

    await batch.commit();
  } catch (err) {
    console.error("Error marking all as read:", err);
    throw err;
  }
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export async function deleteNotification(notificationId) {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);
  } catch (err) {
    console.error("Error deleting notification:", err);
    throw err;
  }
}

/**
 * Clear all notifications for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function clearAllNotifications(userId) {
  try {
    const batch = writeBatch(db);
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("userId", "==", userId));

    const snapshot = await getDocs(q);
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (err) {
    console.error("Error clearing notifications:", err);
    throw err;
  }
}

/**
 * Get unread notification count
 * @param {string} userId - User ID
 * @returns {Promise<number>}
 */
export async function getUnreadCount(userId) {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (err) {
    console.error("Error getting unread count:", err);
    return 0;
  }
}

/**
 * Get notification preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
export async function getNotificationPreferences(userId) {
  try {
    const prefRef = doc(db, "notificationPreferences", userId);
    const snapshot = await getDoc(prefRef);

    if (!snapshot.exists()) {
      // Return default preferences
      return {
        userId,
        inApp: true,
        email: true,
        push: true,
        orderUpdates: true,
        messages: true,
        reviews: true,
        promotions: false,
        sound: true,
        vibration: true
      };
    }

    return snapshot.data();
  } catch (err) {
    console.error("Error fetching notification preferences:", err);
    return {};
  }
}

/**
 * Update notification preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Preference updates
 * @returns {Promise<void>}
 */
export async function updateNotificationPreferences(userId, preferences) {
  try {
    const prefRef = doc(db, "notificationPreferences", userId);
    await updateDoc(prefRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    // If document doesn't exist, create it
    if (err.code === "not-found") {
      const prefRef = doc(db, "notificationPreferences", userId);
      await setDoc(prefRef, {
        userId,
        ...preferences,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      throw err;
    }
  }
}

/**
 * Send notifications to multiple users (batch operation)
 * @param {Array<string>} userIds - Array of user IDs
 * @param {Object} notificationData - Same as createNotification
 * @returns {Promise<void>}
 */
export async function broadcastNotification(userIds, notificationData) {
  try {
    const batch = writeBatch(db);
    const notificationsRef = collection(db, "notifications");

    userIds.forEach(userId => {
      const docRef = doc(notificationsRef);
      batch.set(docRef, {
        userId,
        ...notificationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        read: false
      });
    });

    await batch.commit();
  } catch (err) {
    console.error("Error broadcasting notifications:", err);
    throw err;
  }
}

/**
 * Get notification by ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>}
 */
export async function getNotificationById(notificationId) {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    const snapshot = await getDoc(notificationRef);

    if (!snapshot.exists()) {
      throw new Error("Notification not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date()
    };
  } catch (err) {
    console.error("Error fetching notification:", err);
    throw err;
  }
}

/**
 * Get notifications by type
 * @param {string} userId - User ID
 * @param {string} type - Notification type
 * @param {number} pageLimit - Max results
 * @returns {Promise<Array>}
 */
export async function getNotificationsByType(userId, type, pageLimit = 10) {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("type", "==", type),
      orderBy("createdAt", "desc"),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (err) {
    console.error("Error fetching notifications by type:", err);
    return [];
  }
}

/**
 * Archive old notifications (delete notifications older than X days)
 * @param {string} userId - User ID
 * @param {number} daysOld - Archive notifications older than this many days
 * @returns {Promise<number>} Number of notifications archived
 */
export async function archiveOldNotifications(userId, daysOld = 30) {
  try {
    const batch = writeBatch(db);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("read", "==", true)
    );

    const snapshot = await getDocs(q);
    let count = 0;

    snapshot.docs.forEach(doc => {
      const createdAt = doc.data().createdAt?.toDate?.();
      if (createdAt && createdAt < cutoffDate) {
        batch.delete(doc.ref);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }

    return count;
  } catch (err) {
    console.error("Error archiving old notifications:", err);
    return 0;
  }
}

export default {
  NOTIFICATION_TYPES,
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  getNotificationPreferences,
  updateNotificationPreferences,
  broadcastNotification,
  getNotificationById,
  getNotificationsByType,
  archiveOldNotifications
};
