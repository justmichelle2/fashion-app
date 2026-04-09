import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

/**
 * NOTIFICATION PREFERENCES
 */
export const getNotificationPreferences = async (userId = null) => {
  try {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) throw new Error("User not logged in");

    const userRef = doc(db, "users", targetUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const preferences = userDoc.data().notificationPreferences || {
      orderUpdates: true,
      messages: true,
      promotions: false,
      weeklyReport: true,
      inquiries: true,
    };

    return {
      success: true,
      preferences,
    };
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateNotificationPreferences = async (preferences) => {
  try {
    if (!auth.currentUser) throw new Error("User not logged in");

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      notificationPreferences: preferences,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      preferences,
    };
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * PAYMENT METHODS
 */
export const getPaymentMethods = async () => {
  try {
    if (!auth.currentUser) throw new Error("User not logged in");

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const paymentMethods = userDoc.data().paymentMethods || [];

    return {
      success: true,
      paymentMethods,
    };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const addPaymentMethod = async (paymentMethod) => {
  try {
    if (!auth.currentUser) throw new Error("User not logged in");

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const currentMethods = userDoc.data().paymentMethods || [];
    const newMethod = {
      id: Date.now().toString(),
      ...paymentMethod,
      createdAt: serverTimestamp(),
      isDefault: currentMethods.length === 0,
    };

    await updateDoc(userRef, {
      paymentMethods: [...currentMethods, newMethod],
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      paymentMethod: newMethod,
    };
  } catch (error) {
    console.error("Error adding payment method:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const removePaymentMethod = async (methodId) => {
  try {
    if (!auth.currentUser) throw new Error("User not logged in");

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const currentMethods = userDoc.data().paymentMethods || [];
    const filtered = currentMethods.filter(m => m.id !== methodId);

    await updateDoc(userRef, {
      paymentMethods: filtered,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing payment method:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * DESIGNER PRICING & SERVICES
 */
export const getPricingAndServices = async (designerId = null) => {
  try {
    const targetUserId = designerId || auth.currentUser?.uid;
    if (!targetUserId) throw new Error("User not logged in");

    const userRef = doc(db, "users", targetUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const pricingData = {
      baseRate: userDoc.data().baseRate || 0,
      services: userDoc.data().services || [],
      priceRange: userDoc.data().priceRange || "",
    };

    return {
      success: true,
      pricing: pricingData,
    };
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updatePricingAndServices = async (pricingData) => {
  try {
    if (!auth.currentUser) throw new Error("User not logged in");

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      baseRate: pricingData.baseRate,
      services: pricingData.services,
      priceRange: pricingData.priceRange,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      pricing: pricingData,
    };
  } catch (error) {
    console.error("Error updating pricing:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * DESIGNER AVAILABILITY
 */
export const getAvailability = async (designerId = null) => {
  try {
    const targetUserId = designerId || auth.currentUser?.uid;
    if (!targetUserId) throw new Error("User not logged in");

    const userRef = doc(db, "users", targetUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const availability = userDoc.data().availability || {
      monday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      tuesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      wednesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      thursday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      friday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      saturday: { isAvailable: false, startTime: "10:00", endTime: "14:00" },
      sunday: { isAvailable: false, startTime: "10:00", endTime: "14:00" },
    };

    return {
      success: true,
      availability,
    };
  } catch (error) {
    console.error("Error fetching availability:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateAvailability = async (availability) => {
  try {
    if (!auth.currentUser) throw new Error("User not logged in");

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      availability,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      availability,
    };
  } catch (error) {
    console.error("Error updating availability:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * ACCOUNT DELETION
 */
export const deleteUserAccount = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("No user logged in");
    }

    const userId = auth.currentUser.uid;

    // Delete user document from Firestore
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

    // Delete Firebase Auth user
    await deleteUser(auth.currentUser);

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
