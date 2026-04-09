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
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { createNotification, NOTIFICATION_TYPES } from "../services/notificationsService";

/**
 * CUSTOMER PROFILE MANAGEMENT
 */

// Get or create customer profile
export const getCustomerProfile = async (userId = null) => {
  try {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) {
      throw new Error("User must be logged in");
    }

    const userRef = doc(db, "users", targetUserId);
    const result = await getDoc(userRef);

    if (!result.exists()) {
      return {
        success: false,
        error: "Profile not found",
      };
    }

    return {
      success: true,
      profile: {
        userId: result.id,
        ...result.data(),
      },
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update customer profile
export const updateCustomerProfile = async (profileData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    
    // Map form field names to Firestore field names
    const updateData = {
      name: profileData.displayName,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      country: profileData.country,
      profilePicture: profileData.profilePicture,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updateData);

    return {
      success: true,
      profile: updateData,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Add favorite designer
export const addFavoriteDesigner = async (designerId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    const currentFavorites = userDoc.data()?.favoriteDesigners || [];

    if (!currentFavorites.includes(designerId)) {
      await updateDoc(userRef, {
        favoriteDesigners: [...currentFavorites, designerId],
        updatedAt: serverTimestamp(),
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding favorite:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Remove favorite designer
export const removeFavoriteDesigner = async (designerId) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    const currentFavorites = userDoc.data()?.favoriteDesigners || [];

    await updateDoc(userRef, {
      favoriteDesigners: currentFavorites.filter((id) => id !== designerId),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing favorite:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get customer's favorite designers
export const getFavoriteDesigners = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    const favoriteIds = userDoc.data()?.favoriteDesigners || [];

    if (favoriteIds.length === 0) {
      return {
        success: true,
        designers: [],
      };
    }

    // Fetch favorite designers' portfolios
    const q = query(
      collection(db, "portfolios"),
      where("designerId", "in", favoriteIds)
    );
    const result = await getDocs(q);

    const designers = result.docs.map((doc) => ({
      portfolioId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      designers,
    };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * MEASUREMENTS MANAGEMENT
 */

// Upload customer measurements
export const uploadCustomerMeasurements = async (measurementData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    // Get customer profile info for notification
    const customerRef = doc(db, "users", auth.currentUser.uid);
    const customerDoc = await getDoc(customerRef);
    const customerName = customerDoc.data()?.name || auth.currentUser.email;

    const measurementRef = doc(collection(db, "customerMeasurements"));
    const measurements = {
      measurementId: measurementRef.id,
      customerId: auth.currentUser.uid,
      measurements: {
        chest: measurementData.chest || 0,
        waist: measurementData.waist || 0,
        hips: measurementData.hips || 0,
        shoulder: measurementData.shoulder || 0,
        sleeveLength: measurementData.sleeveLength || 0,
        torsoLength: measurementData.torsoLength || 0,
        inseam: measurementData.inseam || 0,
        height: measurementData.height || 0,
        neck: measurementData.neck || 0,
        customFields: measurementData.customFields || {},
      },
      unit: measurementData.unit || "cm",
      notes: measurementData.notes || "",
      photo: measurementData.photo || "", // Photo reference
      verified: false,
      verifiedBy: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(measurementRef, measurements);

    // Notify designers: Find all active orders for this customer and notify their designers
    try {
      const ordersRef = collection(db, "orders");
      const ordersQuery = query(
        ordersRef,
        where("customerId", "==", auth.currentUser.uid),
        where("status", "in", ["pending", "confirmed", "in-progress"])
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      console.log(`Found ${ordersSnapshot.docs.length} active orders for customer. Notifying designers...`);

      // Create notifications for each designer
      for (const orderDoc of ordersSnapshot.docs) {
        const order = orderDoc.data();
        if (order.designerId) {
          try {
            await createNotification({
              userId: order.designerId,
              type: NOTIFICATION_TYPES.MEASUREMENT_UPLOADED,
              title: "New Measurements Uploaded",
              message: `${customerName} has uploaded their measurements for order #${orderDoc.id.substring(0, 8)}`,
              relatedId: orderDoc.id,
              relatedType: "order",
              data: {
                customerId: auth.currentUser.uid,
                customerName: customerName,
                orderStatus: order.status,
              },
              priority: "high"
            });
            console.log(`Notification sent to designer ${order.designerId}`);
          } catch (notifErr) {
            console.warn(`Failed to notify designer ${order.designerId}:`, notifErr.message);
          }
        }
      }
    } catch (notifErr) {
      console.warn("Error notifying designers:", notifErr.message);
      // Don't fail the measurement upload if notifications fail
    }

    return {
      success: true,
      measurementId: measurementRef.id,
      measurements,
    };
  } catch (error) {
    console.error("Error uploading measurements:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get customer measurements
export const getCustomerMeasurements = async (customerId = null) => {
  try {
    const targetId = customerId || auth.currentUser?.uid;
    if (!targetId) {
      throw new Error("Customer ID required");
    }

    const q = query(
      collection(db, "customerMeasurements"),
      where("customerId", "==", targetId),
      orderBy("createdAt", "desc")
    );

    const result = await getDocs(q);
    const measurementsList = result.docs.map((doc) => ({
      measurementId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      measurements: measurementsList,
    };
  } catch (error) {
    console.error("Error fetching measurements:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update measurement record
export const updateCustomerMeasurements = async (measurementId, updates) => {
  try {
    const measurementRef = doc(db, "customerMeasurements", measurementId);
    await updateDoc(measurementRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating measurements:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get latest measurement
export const getLatestMeasurement = async (customerId = null) => {
  try {
    const targetId = customerId || auth.currentUser?.uid;
    if (!targetId) {
      throw new Error("Customer ID required");
    }

    const q = query(
      collection(db, "customerMeasurements"),
      where("customerId", "==", targetId),
      orderBy("createdAt", "desc")
    );

    const result = await getDocs(q);

    if (result.empty) {
      return {
        success: false,
        error: "No measurements found",
      };
    }

    const measurement = result.docs[0];
    return {
      success: true,
      measurement: {
        measurementId: measurement.id,
        ...measurement.data(),
      },
    };
  } catch (error) {
    console.error("Error fetching latest measurement:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * DESIGNER SEARCH & DISCOVERY
 */

// Search designers by specialty
export const searchDesigners = async (filters = {}) => {
  try {
    let q = query(
      collection(db, "portfolios"),
      where("availability", "==", "available")
    );

    if (filters.specialty) {
      q = query(
        collection(db, "portfolios"),
        where("specialty", "==", filters.specialty),
        where("availability", "==", "available")
      );
    }

    const result = await getDocs(q);
    const designers = result.docs.map((doc) => ({
      portfolioId: doc.id,
      ...doc.data(),
    }));

    // Sort by rating if available
    if (filters.sortBy === "rating") {
      designers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return {
      success: true,
      designers,
    };
  } catch (error) {
    console.error("Error searching designers:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer profile
export const getDesignerProfile = async (designerId) => {
  try {
    const q = query(
      collection(db, "portfolios"),
      where("designerId", "==", designerId)
    );

    const result = await getDocs(q);

    if (result.empty) {
      return {
        success: false,
        error: "Designer not found",
      };
    }

    const portfolio = result.docs[0];
    return {
      success: true,
      designer: {
        portfolioId: portfolio.id,
        ...portfolio.data(),
      },
    };
  } catch (error) {
    console.error("Error fetching designer profile:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * BOOKING & INQUIRY MANAGEMENT
 */

// Create booking inquiry
export const createBookingInquiry = async (inquiryData) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    const inquiryRef = doc(collection(db, "bookingInquiries"));
    const inquiry = {
      inquiryId: inquiryRef.id,
      customerId: auth.currentUser.uid,
      designerId: inquiryData.designerId || "",
      title: inquiryData.title || "",
      description: inquiryData.description || "",
      garmentType: inquiryData.garmentType || "", // dress, suit, traditional, casual, wedding, etc.
      budget: inquiryData.budget || 0,
      preferredDeadline: inquiryData.preferredDeadline || "",
      inspirationImages: inquiryData.inspirationImages || [], // URL references
      specifications: inquiryData.specifications || {
        color: "",
        fabric: "",
        style: "",
        additionalNotes: "",
      },
      referenceDesigners: inquiryData.referenceDesigners || [], // Designer IDs
      status: "pending", // pending, responded, booked, rejected, cancelled
      quotedPrice: null,
      response: null,
      createdAt: serverTimestamp(),
      respondedAt: null,
      bookedAt: null,
      updatedAt: serverTimestamp(),
    };

    await setDoc(inquiryRef, inquiry);

    return {
      success: true,
      inquiryId: inquiryRef.id,
      inquiry,
    };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get customer inquiries
export const getCustomerInquiries = async (filters = {}) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    let q = query(
      collection(db, "bookingInquiries"),
      where("customerId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    if (filters.status) {
      q = query(
        collection(db, "bookingInquiries"),
        where("customerId", "==", auth.currentUser.uid),
        where("status", "==", filters.status),
        orderBy("createdAt", "desc")
      );
    }

    const result = await getDocs(q);
    const inquiries = result.docs.map((doc) => ({
      inquiryId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      inquiries,
    };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get designer inquiries
export const getDesignerInquiries = async (filters = {}) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be logged in");
    }

    let q = query(
      collection(db, "bookingInquiries"),
      where("designerId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    if (filters.status) {
      q = query(
        collection(db, "bookingInquiries"),
        where("designerId", "==", auth.currentUser.uid),
        where("status", "==", filters.status),
        orderBy("createdAt", "desc")
      );
    }

    const result = await getDocs(q);
    const inquiries = result.docs.map((doc) => ({
      inquiryId: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      inquiries,
    };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Respond to booking inquiry
export const respondToInquiry = async (inquiryId, responseData) => {
  try {
    const inquiryRef = doc(db, "bookingInquiries", inquiryId);
    await updateDoc(inquiryRef, {
      status: "responded",
      quotedPrice: responseData.quotedPrice || 0,
      response: responseData.response || "",
      respondedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error responding to inquiry:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Accept booking (convert inquiry to order)
export const acceptBooking = async (inquiryId) => {
  try {
    const inquiryRef = doc(db, "bookingInquiries", inquiryId);
    const inquiryDoc = await getDoc(inquiryRef);

    if (!inquiryDoc.exists()) {
      throw new Error("Inquiry not found");
    }

    const inquiryData = inquiryDoc.data();

    // Create order from booking
    const orderRef = doc(collection(db, "orders"));
    const order = {
      orderId: orderRef.id,
      customerId: inquiryData.customerId,
      designerId: inquiryData.designerId,
      inquiryId: inquiryId,
      title: inquiryData.title,
      description: inquiryData.description,
      items: [
        {
          name: inquiryData.garmentType || "Design Work",
          price: inquiryData.quotedPrice || inquiryData.budget,
          quantity: 1,
        },
      ],
      subtotal: inquiryData.quotedPrice || inquiryData.budget,
      tax: 0,
      shipping: 0,
      total: inquiryData.quotedPrice || inquiryData.budget,
      status: "confirmed",
      paymentStatus: "pending",
      specifications: inquiryData.specifications,
      deadline: inquiryData.preferredDeadline,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(orderRef, order);

    // Update inquiry status
    await updateDoc(inquiryRef, {
      status: "booked",
      bookedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      orderId: orderRef.id,
      order,
    };
  } catch (error) {
    console.error("Error accepting booking:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Reject booking inquiry
export const rejectInquiry = async (inquiryId, reason = "") => {
  try {
    const inquiryRef = doc(db, "bookingInquiries", inquiryId);
    await updateDoc(inquiryRef, {
      status: "rejected",
      response: reason,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error rejecting inquiry:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
