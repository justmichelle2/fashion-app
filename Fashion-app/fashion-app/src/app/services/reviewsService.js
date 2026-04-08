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
  increment,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * DESIGNER RATINGS & REVIEWS SERVICE
 * Handles posting, fetching, and calculating designer reviews
 */

/**
 * Submit a review for a designer after order completion
 * @param {Object} reviewData - Review submission data
 * @param {string} reviewData.designerId - Designer ID being reviewed
 * @param {string} reviewData.customerId - Customer ID submitting review
 * @param {string} reviewData.orderId - Completed order ID
 * @param {number} reviewData.rating - Rating 1-5 stars
 * @param {string} reviewData.title - Review title
 * @param {string} reviewData.comment - Review comment
 * @returns {Promise<string>} Review document ID
 */
export async function submitReview(reviewData) {
  const {
    designerId,
    customerId,
    orderId,
    rating,
    title,
    comment
  } = reviewData;

  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Create review document
    const reviewsRef = collection(db, "reviews");
    const newReview = await addDoc(reviewsRef, {
      designerId,
      customerId,
      orderId,
      rating,
      title,
      comment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      helpful: 0,
      verified: true // Verified because linked to real order
    });

    // Update designer's rating aggregate
    await updateDesignerRating(designerId);

    // Mark order as reviewed
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      reviewSent: true,
      reviewedAt: serverTimestamp()
    });

    return newReview.id;
  } catch (err) {
    console.error("Error submitting review:", err);
    throw err;
  }
}

/**
 * Get all reviews for a designer
 * @param {string} designerId - Designer ID
 * @param {Object} options - Query options
 * @param {number} options.pageLimit - Max results
 * @returns {Promise<Array>}
 */
export async function getDesignerReviews(designerId, options = {}) {
  const { pageLimit = 20 } = options;

  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(
      reviewsRef,
      where("designerId", "==", designerId),
      where("verified", "==", true),
      orderBy("createdAt", "desc"),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (err) {
    console.error("Error fetching designer reviews:", err);
    return [];
  }
}

/**
 * Get reviews summary (ratings breakdown)
 * @param {string} designerId - Designer ID
 * @returns {Promise<Object>}
 */
export async function getReviewsSummary(designerId) {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(
      reviewsRef,
      where("designerId", "==", designerId),
      where("verified", "==", true)
    );

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => doc.data().rating);

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    // Calculate breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(rating => {
      breakdown[Math.round(rating)]++;
    });

    const averageRating = (reviews.reduce((a, b) => a + b, 0) / reviews.length).toFixed(1);

    return {
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length,
      ratingBreakdown: breakdown
    };
  } catch (err) {
    console.error("Error calculating reviews summary:", err);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
}

/**
 * Get top-rated reviews for a designer
 * @param {string} designerId - Designer ID
 * @param {number} count - Number of top reviews
 * @returns {Promise<Array>}
 */
export async function getTopDesignerReviews(designerId, count = 5) {
  try {
    const reviews = await getDesignerReviews(designerId, { pageLimit: 50 });
    return reviews
      .sort((a, b) => {
        // Sort by helpful count, then rating
        if (b.helpful !== a.helpful) return b.helpful - a.helpful;
        return b.rating - a.rating;
      })
      .slice(0, count);
  } catch (err) {
    console.error("Error fetching top reviews:", err);
    return [];
  }
}

/**
 * Mark review as helpful
 * @param {string} reviewId - Review ID
 * @returns {Promise<void>}
 */
export async function markReviewHelpful(reviewId) {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, {
      helpful: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Error marking review as helpful:", err);
    throw err;
  }
}

/**
 * Delete a review (admin/self only)
 * @param {string} reviewId - Review ID
 * @param {string} designerId - Designer ID (for rating recalc)
 * @returns {Promise<void>}
 */
export async function deleteReview(reviewId, designerId) {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    // Mark as deleted rather than removing (audit trail)
    await updateDoc(reviewRef, {
      deleted: true,
      deletedAt: serverTimestamp()
    });

    // Recalculate designer rating
    await updateDesignerRating(designerId);
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
}

/**
 * Update designer's average rating based on reviews
 * @param {string} designerId - Designer ID
 * @returns {Promise<void>}
 */
export async function updateDesignerRating(designerId) {
  try {
    const summary = await getReviewsSummary(designerId);
    const designerRef = doc(db, "designers", designerId);

    await updateDoc(designerRef, {
      rating: summary.averageRating,
      reviewCount: summary.totalReviews,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Error updating designer rating:", err);
  }
}

/**
 * Get customer's reviews (reviews they submitted)
 * @param {string} customerId - Customer ID
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
export async function getCustomerReviews(customerId, pageLimit = 20) {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(
      reviewsRef,
      where("customerId", "==", customerId),
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
    console.error("Error fetching customer reviews:", err);
    return [];
  }
}

/**
 * Check if customer already reviewed order
 * @param {string} orderId - Order ID
 * @returns {Promise<boolean>}
 */
export async function hasReviewedOrder(orderId) {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("orderId", "==", orderId));

    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (err) {
    console.error("Error checking review status:", err);
    return false;
  }
}

/**
 * Get review by ID
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>}
 */
export async function getReviewById(reviewId) {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    const snapshot = await getDoc(reviewRef);

    if (!snapshot.exists()) {
      throw new Error("Review not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date()
    };
  } catch (err) {
    console.error("Error fetching review:", err);
    throw err;
  }
}

/**
 * Bulk update multiple designer ratings (for admin/analytics)
 * @param {Array<string>} designerIds - Array of designer IDs
 * @returns {Promise<void>}
 */
export async function bulkUpdateDesignerRatings(designerIds) {
  try {
    const batch = writeBatch(db);

    for (const designerId of designerIds) {
      const summary = await getReviewsSummary(designerId);
      const designerRef = doc(db, "designers", designerId);

      batch.update(designerRef, {
        rating: summary.averageRating,
        reviewCount: summary.totalReviews
      });
    }

    await batch.commit();
  } catch (err) {
    console.error("Error bulk updating ratings:", err);
    throw err;
  }
}

export default {
  submitReview,
  getDesignerReviews,
  getReviewsSummary,
  getTopDesignerReviews,
  markReviewHelpful,
  deleteReview,
  updateDesignerRating,
  getCustomerReviews,
  hasReviewedOrder,
  getReviewById,
  bulkUpdateDesignerRatings
};
