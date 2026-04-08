import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * ============================================
 * DESIGNER SEARCH & FILTERING SERVICE
 * ============================================
 */

/**
 * GET ALL DESIGNERS
 * Fetches all designers with optional filtering and sorting
 */
export const getAllDesigners = async (options = {}) => {
  try {
    const {
      specialty = null,
      minRating = 0,
      search = null,
      sortBy = "rating", // rating, name, experience, reviews
      limit: pageLimit = 50,
    } = options;

    const designersRef = collection(db, "users");
    const constraints = [where("role", "==", "designer"), where("verified", "==", true)];

    // Apply rating filter
    if (minRating > 0) {
      constraints.push(where("rating", ">=", minRating));
    }

    // Apply specialty filter
    if (specialty) {
      constraints.push(where("specialty", "==", specialty));
    }

    // Add sorting
    if (sortBy === "rating") {
      constraints.push(orderBy("rating", "desc"));
    } else if (sortBy === "name") {
      constraints.push(orderBy("name", "asc"));
    } else if (sortBy === "experience") {
      constraints.push(orderBy("experience", "desc"));
    }

    constraints.push(limit(pageLimit));

    const q = query(designersRef, ...constraints);
    const snapshot = await getDocs(q);

    let designers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search filter (name, bio, specialty)
    if (search) {
      const searchLower = search.toLowerCase();
      designers = designers.filter(
        (d) =>
          d.name?.toLowerCase().includes(searchLower) ||
          d.specialty?.toLowerCase().includes(searchLower) ||
          d.bio?.toLowerCase().includes(searchLower)
      );
    }

    return {
      success: true,
      designers,
      total: designers.length,
    };
  } catch (error) {
    console.error("Error fetching designers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET DESIGNER BY ID
 * Fetches a specific designer's profile with full details
 */
export const getDesignerById = async (designerId) => {
  try {
    if (!designerId) {
      throw new Error("Designer ID is required");
    }

    const designersRef = collection(db, "users");
    const q = query(designersRef, where("role", "==", "designer"));
    const snapshot = await getDocs(q);

    const designer = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .find((d) => d.id === designerId);

    if (!designer) {
      return { success: false, error: "Designer not found" };
    }

    // Fetch designer's portfolio and reviews
    const ordersRef = collection(db, "orders");
    const designerOrders = query(ordersRef, where("designerId", "==", designerId));
    const ordersSnapshot = await getDocs(designerOrders);

    const completedOrders = ordersSnapshot.docs
      .filter((doc) => doc.data().status === "completed")
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      success: true,
      designer: {
        ...designer,
        completedProjects: completedOrders.length,
        portfolio: designer.portfolio || [],
      },
    };
  } catch (error) {
    console.error("Error fetching designer:", error);
    return { success: false, error: error.message };
  }
};

/**
 * SEARCH DESIGNERS
 * Advanced search with multiple filters
 */
export const searchDesigners = async (filters = {}) => {
  try {
    const {
      keyword = "",
      specialty = null,
      minPrice = 0,
      maxPrice = 999999,
      minRating = 0,
      minExperience = 0,
      location = null,
      sortBy = "rating",
    } = filters;

    const designersRef = collection(db, "users");
    const constraints = [
      where("role", "==", "designer"),
      where("verified", "==", true),
    ];

    // Add filters to query
    if (minRating > 0) {
      constraints.push(where("rating", ">=", minRating));
    }

    if (specialty) {
      constraints.push(where("specialty", "==", specialty));
    }

    if (minExperience > 0) {
      constraints.push(where("experience", ">=", minExperience));
    }

    // Add sorting
    if (sortBy === "rating") {
      constraints.push(orderBy("rating", "desc"));
    } else if (sortBy === "price-low") {
      constraints.push(orderBy("hourlyRate", "asc"));
    } else if (sortBy === "price-high") {
      constraints.push(orderBy("hourlyRate", "desc"));
    } else if (sortBy === "newest") {
      constraints.push(orderBy("createdAt", "desc"));
    } else if (sortBy === "experience") {
      constraints.push(orderBy("experience", "desc"));
    }

    const q = query(designersRef, ...constraints);
    const snapshot = await getDocs(q);

    let designers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side filters and search
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      designers = designers.filter(
        (d) =>
          d.name?.toLowerCase().includes(keywordLower) ||
          d.specialty?.toLowerCase().includes(keywordLower) ||
          d.bio?.toLowerCase().includes(keywordLower)
      );
    }

    if (location) {
      const locationLower = location.toLowerCase();
      designers = designers.filter(
        (d) =>
          d.city?.toLowerCase().includes(locationLower) ||
          d.country?.toLowerCase().includes(locationLower)
      );
    }

    designers = designers.filter((d) => {
      const rate = d.hourlyRate || 0;
      return rate >= minPrice && rate <= maxPrice;
    });

    return {
      success: true,
      designers,
      total: designers.length,
      filters: {
        keyword,
        specialty,
        minPrice,
        maxPrice,
        minRating,
        minExperience,
        location,
        sortBy,
      },
    };
  } catch (error) {
    console.error("Error searching designers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET DESIGNERS BY SPECIALTY
 * Filters designers by their specialty/category
 */
export const getDesignersBySpecialty = async (specialty) => {
  try {
    if (!specialty) {
      throw new Error("Specialty is required");
    }

    const designersRef = collection(db, "users");
    const q = query(
      designersRef,
      where("role", "==", "designer"),
      where("specialty", "==", specialty),
      where("verified", "==", true),
      orderBy("rating", "desc")
    );

    const snapshot = await getDocs(q);
    const designers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      designers,
      specialty,
      total: designers.length,
    };
  } catch (error) {
    console.error("Error fetching designers by specialty:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET TOP RATED DESIGNERS
 * Returns most highly rated designers
 */
export const getTopRatedDesigners = async (count = 10) => {
  try {
    const designersRef = collection(db, "users");
    const q = query(
      designersRef,
      where("role", "==", "designer"),
      where("verified", "==", true),
      orderBy("rating", "desc"),
      limit(count)
    );

    const snapshot = await getDocs(q);
    const designers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      designers,
      total: designers.length,
    };
  } catch (error) {
    console.error("Error fetching top designers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET DESIGNERS BY PRICE RANGE
 * Filters designers by hourly rate
 */
export const getDesignersByPriceRange = async (minPrice, maxPrice) => {
  try {
    if (minPrice === undefined || maxPrice === undefined) {
      throw new Error("Price range is required");
    }

    const designersRef = collection(db, "users");
    const q = query(
      designersRef,
      where("role", "==", "designer"),
      where("verified", "==", true),
      where("hourlyRate", ">=", minPrice),
      where("hourlyRate", "<=", maxPrice),
      orderBy("hourlyRate", "asc")
    );

    const snapshot = await getDocs(q);
    const designers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      designers,
      priceRange: { min: minPrice, max: maxPrice },
      total: designers.length,
    };
  } catch (error) {
    console.error("Error fetching designers by price:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET AVAILABLE SPECIALTIES
 * Returns all available design specialties/categories
 */
export const getAvailableSpecialties = async () => {
  try {
    const designersRef = collection(db, "users");
    const q = query(designersRef, where("role", "==", "designer"), where("verified", "==", true));

    const snapshot = await getDocs(q);
    const designers = snapshot.docs.map((doc) => doc.data());

    // Extract unique specialties
    const specialties = [...new Set(designers.map((d) => d.specialty).filter(Boolean))];

    return {
      success: true,
      specialties: specialties.sort(),
      total: specialties.length,
    };
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return { success: false, error: error.message };
  }
};

/**
 * FILTER DESIGNER SUGGESTIONS
 * Get personalized designer recommendations
 */
export const getDesignerSuggestions = async (customerId, limit = 5) => {
  try {
    // For now, return top-rated designers
    // In production, use customer's order history and preferences
    const result = await getTopRatedDesigners(limit);
    return result;
  } catch (error) {
    console.error("Error getting designer suggestions:", error);
    return { success: false, error: error.message };
  }
};

/**
 * DESIGNER COMPARISON
 * Compare multiple designers side by side
 */
export const compareDesigners = async (designerIds) => {
  try {
    if (!designerIds || designerIds.length === 0) {
      throw new Error("Designer IDs are required");
    }

    const designersRef = collection(db, "users");
    const designers = [];

    for (const id of designerIds) {
      const q = query(designersRef, where("role", "==", "designer"));
      const snapshot = await getDocs(q);
      const designer = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((d) => d.id === id);

      if (designer) {
        designers.push(designer);
      }
    }

    return {
      success: true,
      designers,
      comparison: {
        totalDesigners: designers.length,
        avgRating: (designers.reduce((sum, d) => sum + (d.rating || 0), 0) / designers.length).toFixed(1),
        avgPrice: (designers.reduce((sum, d) => sum + (d.hourlyRate || 0), 0) / designers.length).toFixed(2),
      },
    };
  } catch (error) {
    console.error("Error comparing designers:", error);
    return { success: false, error: error.message };
  }
};
