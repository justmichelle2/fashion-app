import { db, auth } from "../firebaseConfig";
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
  deleteDoc
} from "firebase/firestore";

const ORDERS_COLLECTION = "orders";
const PAYMENTS_COLLECTION = "payments";

/**
 * Create a new order
 * @param {object} orderData - Order information
 * @returns {Promise<{success: boolean, orderId?: string, error?: string}>}
 */
export const createOrder = async (orderData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "User must be logged in to create order"
      };
    }

    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      return {
        success: false,
        error: "Order must contain at least one item"
      };
    }

    if (!orderData.total || orderData.total <= 0) {
      return {
        success: false,
        error: "Order total must be greater than 0"
      };
    }

    // Generate order ID
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const orderDoc = doc(ordersRef);
    const orderId = orderDoc.id;

    // Calculate totals if not provided
    const subtotal = orderData.subtotal || orderData.total;
    const tax = orderData.tax || 0;
    const shipping = orderData.shipping || 0;

    // Create order object
    const order = {
      orderId,
      userId: user.uid,
      userEmail: user.email,
      items: orderData.items, // [{id, name, price, quantity, designerId}, ...]
      subtotal,
      tax,
      shipping,
      total: orderData.total,
      status: "pending", // pending, confirmed, in_progress, completed, cancelled
      paymentStatus: "pending", // pending, paid, failed, refunded
      paymentMethod: orderData.paymentMethod || "card", // card, momo, bank_transfer
      shippingAddress: orderData.shippingAddress || {},
      notes: orderData.notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      estimatedDelivery: orderData.estimatedDelivery || null,
      trackingNumber: null,
      ...orderData
    };

    // Save order to Firestore
    await setDoc(orderDoc, order);

    console.log("Order created successfully:", orderId);

    return {
      success: true,
      orderId
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error.message || "Failed to create order"
    };
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, order?: object, error?: string}>}
 */
export const getOrder = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return {
        success: false,
        error: "Order not found"
      };
    }

    return {
      success: true,
      order: orderSnap.data()
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch order"
    };
  }
};

/**
 * Get all orders for current user
 * @returns {Promise<{success: boolean, orders?: array, error?: string}>}
 */
export const getUserOrders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "User must be logged in"
      };
    }

    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders = [];

    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });

    return {
      success: true,
      orders
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch orders"
    };
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      };
    }

    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });

    console.log(`Order ${orderId} status updated to ${status}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: error.message || "Failed to update order status"
    };
  }
};

/**
 * Update payment status
 * @param {string} orderId - Order ID
 * @param {string} paymentStatus - New payment status
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updatePaymentStatus = async (orderId, paymentStatus, transactionId = null) => {
  try {
    const validStatuses = ["pending", "paid", "failed", "refunded"];

    if (!validStatuses.includes(paymentStatus)) {
      return {
        success: false,
        error: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`
      };
    }

    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const updateData = {
      paymentStatus,
      updatedAt: serverTimestamp()
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    await updateDoc(orderRef, updateData);

    // If payment is successful, update order status to confirmed
    if (paymentStatus === "paid") {
      await updateDoc(orderRef, {
        status: "confirmed"
      });
    }

    console.log(`Order ${orderId} payment status updated to ${paymentStatus}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return {
      success: false,
      error: error.message || "Failed to update payment status"
    };
  }
};

/**
 * Record payment transaction
 * @param {string} orderId - Order ID
 * @param {object} paymentData - Payment information
 * @returns {Promise<{success: boolean, transactionId?: string, error?: string}>}
 */
export const recordPayment = async (orderId, paymentData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "User must be logged in"
      };
    }

    // Validate payment data
    if (!paymentData.amount || paymentData.amount <= 0) {
      return {
        success: false,
        error: "Payment amount must be greater than 0"
      };
    }

    if (!paymentData.method) {
      return {
        success: false,
        error: "Payment method is required"
      };
    }

    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const paymentDoc = doc(paymentsRef);
    const transactionId = paymentDoc.id;

    const payment = {
      transactionId,
      orderId,
      userId: user.uid,
      amount: paymentData.amount,
      method: paymentData.method, // card, momo, bank_transfer
      status: "completed", // completed, pending, failed
      reference: paymentData.reference || null,
      metadata: paymentData.metadata || {},
      createdAt: serverTimestamp(),
      ...paymentData
    };

    await setDoc(paymentDoc, payment);

    // Update order payment status
    await updatePaymentStatus(orderId, "paid", transactionId);

    console.log("Payment recorded successfully:", transactionId);

    return {
      success: true,
      transactionId
    };
  } catch (error) {
    console.error("Error recording payment:", error);
    return {
      success: false,
      error: error.message || "Failed to record payment"
    };
  }
};

/**
 * Get payment details
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<{success: boolean, payment?: object, error?: string}>}
 */
export const getPayment = async (transactionId) => {
  try {
    const paymentRef = doc(db, PAYMENTS_COLLECTION, transactionId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      return {
        success: false,
        error: "Payment not found"
      };
    }

    return {
      success: true,
      payment: paymentSnap.data()
    };
  } catch (error) {
    console.error("Error fetching payment:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch payment"
    };
  }
};

/**
 * Get all payments for an order
 * @param {string} orderId - Order ID
 * @returns {Promise<{success: boolean, payments?: array, error?: string}>}
 */
export const getOrderPayments = async (orderId) => {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where("orderId", "==", orderId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const payments = [];

    querySnapshot.forEach((doc) => {
      payments.push(doc.data());
    });

    return {
      success: true,
      payments
    };
  } catch (error) {
    console.error("Error fetching order payments:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch payments"
    };
  }
};

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const cancelOrder = async (orderId, reason = "") => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    
    await updateDoc(orderRef, {
      status: "cancelled",
      cancellationReason: reason,
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log(`Order ${orderId} cancelled`);

    return { success: true };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      error: error.message || "Failed to cancel order"
    };
  }
};

/**
 * Update order tracking information
 * @param {string} orderId - Order ID
 * @param {string} trackingNumber - Tracking number
 * @param {string} estimatedDelivery - Estimated delivery date
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateOrderTracking = async (orderId, trackingNumber, estimatedDelivery = null) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);

    await updateDoc(orderRef, {
      trackingNumber,
      estimatedDelivery,
      status: "in_progress",
      updatedAt: serverTimestamp()
    });

    console.log(`Order ${orderId} tracking updated`);

    return { success: true };
  } catch (error) {
    console.error("Error updating tracking:", error);
    return {
      success: false,
      error: error.message || "Failed to update tracking"
    };
  }
};
