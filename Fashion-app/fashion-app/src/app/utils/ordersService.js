import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * CREATE ORDER
 * Creates a new tailoring order in Firestore
 */
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, "orders");
    const newOrder = {
      customerId: orderData.customerId,
      designerId: orderData.designerId,
      designerName: orderData.designerName,
      status: "pending", // pending | accepted | tailoring | completed | cancelled
      description: orderData.description,
      measurements: orderData.measurements,
      price: parseFloat(orderData.price),
      deadlineDate: orderData.deadlineDate,
      notes: orderData.notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(ordersRef, newOrder);
    return { success: true, orderId: docRef.id, order: newOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET ORDER BY ID
 * Fetches a specific order details
 */
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { success: true, order: { id: orderId, ...orderSnap.data() } };
    } else {
      return { success: false, error: "Order not found" };
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET CUSTOMER ORDERS
 * Fetches all orders for a specific customer
 */
export const getCustomerOrders = async (customerId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET DESIGNER ORDERS
 * Fetches all orders for a specific designer
 */
export const getDesignerOrders = async (designerId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("designerId", "==", designerId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching designer orders:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPDATE ORDER STATUS
 * Updates the status of an order (pending -> accepted -> tailoring -> completed)
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const validStatuses = ["pending", "accepted", "tailoring", "completed", "cancelled"];
  
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    const orderRef = doc(db, "orders", orderId);
    
    const updateData = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };

    // Add specific timestamps for status changes
    if (newStatus === "accepted") {
      updateData.acceptedAt = serverTimestamp();
    } else if (newStatus === "completed") {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(orderRef, updateData);
    return { success: true, message: `Order status updated to ${newStatus}` };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPDATE ORDER (General update)
 * Updates any order fields (price, deadline, notes, etc.)
 */
export const updateOrder = async (orderId, updates) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(orderRef, dataToUpdate);
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * ACCEPT ORDER
 * Designer accepts an order
 */
export const acceptOrder = async (orderId, quote = null) => {
  try {
    const updates = {
      status: "accepted",
      acceptedAt: serverTimestamp(),
    };

    // Update quote if designer wants to adjust price
    if (quote !== null) {
      updates.quote = parseFloat(quote);
    }

    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, updates);
    
    return { success: true, message: "Order accepted" };
  } catch (error) {
    console.error("Error accepting order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * REJECT ORDER
 * Designer rejects an order and returns to pending
 */
export const rejectOrder = async (orderId, reason) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "pending",
      rejectionReason: reason,
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { success: true, message: "Order rejected" };
  } catch (error) {
    console.error("Error rejecting order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * CANCEL ORDER
 * Customer or admin cancels an order
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "cancelled",
      cancellationReason: reason,
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { success: true, message: "Order cancelled" };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * ADD ORDER REVIEW & RATING
 * Customer reviews completed order
 */
export const addOrderReview = async (orderId, rating, comment, images = []) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      review: {
        rating: parseInt(rating),
        comment,
        images,
        createdAt: serverTimestamp(),
      },
      reviewSent: true,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true, message: "Review added successfully" };
  } catch (error) {
    console.error("Error adding review:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET ORDER STATISTICS
 * Get order stats for dashboard
 */
export const getOrderStatistics = async (userId, userRole = "customer") => {
  try {
    const ordersRef = collection(db, "orders");
    const whereField = userRole === "designer" ? "designerId" : "customerId";
    
    const q = query(ordersRef, where(whereField, "==", userId));
    const querySnapshot = await getDocs(q);
    
    const stats = {
      total: 0,
      pending: 0,
      accepted: 0,
      tailoring: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
    };

    querySnapshot.forEach((doc) => {
      const order = doc.data();
      stats.total += 1;
      stats[order.status] = (stats[order.status] || 0) + 1;
      
      if (order.status === "completed") {
        stats.totalRevenue += order.price || 0;
      }
    });

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return { success: false, error: error.message };
  }
};
