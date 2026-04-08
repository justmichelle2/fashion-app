import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * MEASUREMENTS SERVICE
 * Handles customer measurements viewing by designers
 */

/**
 * Get measurements for a specific customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>}
 */
export async function getCustomerMeasurements(customerId) {
  try {
    const measurementsRef = collection(db, "measurements");
    const q = query(measurementsRef, where("customerId", "==", customerId));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
      lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
    };
  } catch (err) {
    console.error("Error fetching customer measurements:", err);
    throw err;
  }
}

/**
 * Get measurements for an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>}
 */
export async function getOrderMeasurements(orderId) {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      throw new Error("Order not found");
    }

    const order = orderSnapshot.data();
    const measurements = await getCustomerMeasurements(order.customerId);

    return measurements;
  } catch (err) {
    console.error("Error fetching order measurements:", err);
    throw err;
  }
}

/**
 * Get all measurements for orders assigned to a designer
 * @param {string} designerId - Designer ID
 * @returns {Promise<Array>}
 */
export async function getDesignerOrdersMeasurements(designerId) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("designerId", "==", designerId));
    
    const ordersSnapshot = await getDocs(q);
    const measurementsMap = new Map();

    for (const orderDoc of ordersSnapshot.docs) {
      const order = orderDoc.data();
      
      try {
        const measurements = await getCustomerMeasurements(order.customerId);
        if (measurements) {
          measurementsMap.set(order.customerId, {
            ...measurements,
            orderId: orderDoc.id,
            customerName: order.customerName || "Unknown",
            orderStatus: order.status
          });
        }
      } catch (err) {
        console.warn(`Could not fetch measurements for order ${orderDoc.id}:`, err);
      }
    }

    return Array.from(measurementsMap.values());
  } catch (err) {
    console.error("Error fetching designer's order measurements:", err);
    return [];
  }
}

/**
 * Mark measurements as viewed by designer
 * @param {string} customerId - Customer ID
 * @param {string} designerId - Designer ID
 * @returns {Promise<void>}
 */
export async function markMeasurementsViewed(customerId, designerId) {
  try {
    const measurementsRef = collection(db, "measurements");
    const q = query(measurementsRef, where("customerId", "==", customerId));
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const measurementDoc = snapshot.docs[0];
      const viewedBy = measurementDoc.data().viewedBy || [];
      
      // Add designer to viewed list if not already there
      if (!viewedBy.includes(designerId)) {
        viewedBy.push(designerId);
        
        await updateDoc(measurementDoc.ref, {
          viewedBy,
          lastViewedAt: serverTimestamp(),
          viewed: true
        });
      }
    }
  } catch (err) {
    console.error("Error marking measurements as viewed:", err);
  }
}

/**
 * Check if measurements have been viewed
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>}
 */
export async function getMeasurementViewStatus(customerId) {
  try {
    const measurements = await getCustomerMeasurements(customerId);
    
    if (!measurements) {
      return null;
    }

    return {
      viewed: measurements.viewed || false,
      viewedBy: measurements.viewedBy || [],
      lastViewedAt: measurements.lastViewedAt
    };
  } catch (err) {
    console.error("Error fetching measurement view status:", err);
    return null;
  }
}

/**
 * Get measurements with images
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>}
 */
export async function getMeasurementsWithImages(customerId) {
  try {
    const measurements = await getCustomerMeasurements(customerId);
    
    if (!measurements) {
      return null;
    }

    // Images are stored in Cloud Storage with paths in the measurement document
    return {
      ...measurements,
      images: {
        front: measurements.frontImage || null,
        side: measurements.sideImage || null,
        back: measurements.backImage || null
      }
    };
  } catch (err) {
    console.error("Error fetching measurements with images:", err);
    throw err;
  }
}

/**
 * Get measurement details with full formatting
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>}
 */
export async function getFormattedMeasurements(customerId) {
  try {
    const measurements = await getCustomerMeasurements(customerId);
    
    if (!measurements) {
      return null;
    }

    // Format measurements for display
    return {
      id: measurements.id,
      customerId: measurements.customerId,
      uploadedAt: measurements.uploadedAt,
      lastUpdated: measurements.lastUpdated,
      
      // Body Measurements
      body: {
        height: {
          value: measurements.height,
          unit: measurements.heightUnit || "cm"
        },
        weight: {
          value: measurements.weight,
          unit: measurements.weightUnit || "kg"
        },
        bust: measurements.bust,
        waist: measurements.waist,
        hips: measurements.hips,
        shoulder: measurements.shoulder,
        sleeve: measurements.sleeve,
        armhole: measurements.armhole,
        chest: measurements.chest
      },

      // Additional Details
      details: {
        bodyType: measurements.bodyType,
        notes: measurements.notes,
        specialRequirements: measurements.specialRequirements
      },

      // Images
      images: {
        front: measurements.frontImage,
        side: measurements.sideImage,
        back: measurements.backImage
      },

      // Status
      verified: measurements.verified || false,
      viewedBy: measurements.viewedBy || []
    };
  } catch (err) {
    console.error("Error formatting measurements:", err);
    throw err;
  }
}

/**
 * Compare measurements (useful for size recommendations)
 * @param {Object} measurements1 - First measurement set
 * @param {Object} measurements2 - Second measurement set
 * @returns {Object} Comparison results
 */
export function compareMeasurements(measurements1, measurements2) {
  const keys = ["bust", "waist", "hips", "shoulder"];
  const comparison = {};

  keys.forEach(key => {
    const m1 = parseFloat(measurements1[key]) || 0;
    const m2 = parseFloat(measurements2[key]) || 0;
    const diff = m2 - m1;
    
    comparison[key] = {
      first: m1,
      second: m2,
      difference: diff,
      percentChange: m1 > 0 ? ((diff / m1) * 100).toFixed(1) : 0
    };
  });

  return comparison;
}

export default {
  getCustomerMeasurements,
  getOrderMeasurements,
  getDesignerOrdersMeasurements,
  markMeasurementsViewed,
  getMeasurementViewStatus,
  getMeasurementsWithImages,
  getFormattedMeasurements,
  compareMeasurements
};
