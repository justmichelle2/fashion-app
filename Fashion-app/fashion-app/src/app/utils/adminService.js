import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * ============================================
 * USER & DESIGNER MANAGEMENT
 * ============================================
 */

/**
 * GET ALL USERS
 * Fetches all users (customers and designers)
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      users,
      total: users.length,
      customers: users.filter((u) => u.role === "customer").length,
      designers: users.filter((u) => u.role === "designer").length,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET ALL DESIGNERS
 * Fetches all designer profiles with stats
 */
export const getAllDesigners = async () => {
  try {
    const designersRef = collection(db, "users");
    const q = query(designersRef, where("role", "==", "designer"));
    const querySnapshot = await getDocs(q);

    const designers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, designers, total: designers.length };
  } catch (error) {
    console.error("Error fetching designers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * DEACTIVATE USER
 * Deactivates a user account
 */
export const deactivateUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      active: false,
      deactivatedAt: serverTimestamp(),
    });

    return { success: true, message: "User deactivated successfully" };
  } catch (error) {
    console.error("Error deactivating user:", error);
    return { success: false, error: error.message };
  }
};

/**
 * ACTIVATE USER
 * Reactivates a deactivated user account
 */
export const activateUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      active: true,
      deactivatedAt: null,
    });

    return { success: true, message: "User activated successfully" };
  } catch (error) {
    console.error("Error activating user:", error);
    return { success: false, error: error.message };
  }
};

/**
 * VERIFY DESIGNER
 * Marks a designer as verified
 */
export const verifyDesigner = async (designerId) => {
  try {
    const designerRef = doc(db, "users", designerId);
    await updateDoc(designerRef, {
      verified: true,
      verifiedAt: serverTimestamp(),
    });

    return { success: true, message: "Designer verified successfully" };
  } catch (error) {
    console.error("Error verifying designer:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPDATE USER ROLE
 * Changes a user's role (customer/designer/admin)
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      roleUpdatedAt: serverTimestamp(),
    });

    return { success: true, message: `User role updated to ${newRole}` };
  } catch (error) {
    console.error("Error updating role:", error);
    return { success: false, error: error.message };
  }
};

/**
 * ============================================
 * ANALYTICS & REPORTING
 * ============================================
 */

/**
 * GET PLATFORM DASHBOARD STATS
 * Returns key metrics for the admin dashboard
 */
export const getPlatformStats = async () => {
  try {
    // Get all users
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalUsers = users.length;
    const totalCustomers = users.filter((u) => u.role === "customer").length;
    const totalDesigners = users.filter((u) => u.role === "designer").length;
    const activateUsers = users.filter((u) => u.active !== false).length;

    // Get all orders
    const ordersRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === "completed").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, order) => sum + (order.price || 0), 0);

    // Get average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get top designers
    const designerOrders = {};
    orders.forEach((order) => {
      if (order.designerId) {
        designerOrders[order.designerId] = (designerOrders[order.designerId] || 0) + 1;
      }
    });

    const topDesigners = Object.entries(designerOrders)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([designerId, count]) => {
        const designer = users.find((u) => u.id === designerId);
        return {
          id: designerId,
          name: designer?.name || "Unknown",
          orderCount: count,
          rating: designer?.rating || 0,
        };
      });

    return {
      success: true,
      stats: {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          designers: totalDesigners,
          active: activateUsers,
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders,
          revenue: totalRevenue,
          averageValue: avgOrderValue,
        },
        topDesigners,
      },
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET ORDER ANALYTICS
 * Detailed order statistics by status and date
 */
export const getOrderAnalytics = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const byStatus = {
      pending: 0,
      accepted: 0,
      tailoring: 0,
      completed: 0,
      cancelled: 0,
    };

    const byMonth = {};
    const priceStats = {
      min: Infinity,
      max: 0,
      average: 0,
      total: 0,
    };

    orders.forEach((order) => {
      // Count by status
      if (byStatus.hasOwnProperty(order.status)) {
        byStatus[order.status]++;
      }

      // Group by month
      if (order.createdAt) {
        const date = new Date(order.createdAt.seconds * 1000);
        const monthKey = date.toLocaleString("default", { month: "short", year: "numeric" });
        byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
      }

      // Price statistics
      if (order.price) {
        priceStats.min = Math.min(priceStats.min, order.price);
        priceStats.max = Math.max(priceStats.max, order.price);
        priceStats.total += order.price;
      }
    });

    priceStats.average = orders.length > 0 ? priceStats.total / orders.length : 0;
    if (priceStats.min === Infinity) priceStats.min = 0;

    return {
      success: true,
      analytics: {
        byStatus,
        byMonth,
        priceStats,
        totalOrders: orders.length,
      },
    };
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET USER GROWTH
 * Track user registration trends
 */
export const getUserGrowth = async () => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const byMonth = {};
    const byRole = { customer: 0, designer: 0 };

    users.forEach((user) => {
      // Group by month
      if (user.createdAt) {
        const date = new Date(user.createdAt.seconds * 1000);
        const monthKey = date.toLocaleString("default", { month: "short", year: "numeric" });
        byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
      }

      // Count by role
      if (user.role === "customer") byRole.customer++;
      else if (user.role === "designer") byRole.designer++;
    });

    return {
      success: true,
      growth: {
        byMonth,
        byRole,
        totalUsers: users.length,
      },
    };
  } catch (error) {
    console.error("Error fetching user growth:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET DESIGNER PERFORMANCE
 * Detailed analytics for each designer
 */
export const getDesignerPerformance = async () => {
  try {
    const designersRef = collection(db, "users");
    const q = query(designersRef, where("role", "==", "designer"));
    const designersSnapshot = await getDocs(q);

    const ordersRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const performance = designersSnapshot.docs.map((doc) => {
      const designer = { id: doc.id, ...doc.data() };
      const designerOrders = orders.filter((o) => o.designerId === designer.id);

      return {
        id: designer.id,
        name: designer.name,
        email: designer.email,
        rating: designer.rating || 0,
        totalOrders: designerOrders.length,
        completedOrders: designerOrders.filter((o) => o.status === "completed").length,
        revenue: designerOrders
          .filter((o) => o.status === "completed")
          .reduce((sum, order) => sum + (order.price || 0), 0),
        avgRating: designer.rating || 0,
        verified: designer.verified || false,
        active: designer.active !== false,
      };
    });

    // Sort by total orders
    performance.sort((a, b) => b.totalOrders - a.totalOrders);

    return { success: true, performance };
  } catch (error) {
    console.error("Error fetching designer performance:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET CUSTOMER INSIGHTS
 * Activity and engagement metrics for customers
 */
export const getCustomerInsights = async () => {
  try {
    const customersRef = collection(db, "users");
    const q = query(customersRef, where("role", "==", "customer"));
    const customersSnapshot = await getDocs(q);

    const ordersRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersRef);
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const insights = {
      totalCustomers: customersSnapshot.size,
      activeCustomers: 0, // customers with orders in last 30 days
      totalSpent: 0,
      avgOrdersPerCustomer: 0,
      repeatCustomers: 0, // customers with 2+ orders
    };

    const customerOrders = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    orders.forEach((order) => {
      if (order.customerId) {
        customerOrders[order.customerId] = (customerOrders[order.customerId] || []).concat(order);
        insights.totalSpent += order.price || 0;

        // Check if active in last 30 days
        if (order.createdAt) {
          const orderDate = new Date(order.createdAt.seconds * 1000);
          if (orderDate > thirtyDaysAgo) {
            insights.activeCustomers++;
          }
        }
      }
    });

    insights.avgOrdersPerCustomer =
      insights.totalCustomers > 0
        ? Object.values(customerOrders).length / insights.totalCustomers
        : 0;

    insights.repeatCustomers = Object.values(customerOrders).filter((os) => os.length > 1).length;

    return { success: true, insights };
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    return { success: false, error: error.message };
  }
};
