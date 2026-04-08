import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  doc,
  getDoc 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Get all designers with optional filters and sorting
 * @param {Object} options - Filter and sort options
 * @param {string} options.specialty - Filter by specialty
 * @param {number} options.minRating - Minimum rating filter
 * @param {string} options.search - Keyword search (client-side)
 * @param {string} options.sortBy - Sort field (rating|name|experience|price)
 * @param {number} options.pageLimit - Max results to return
 * @returns {Promise<{designers: Array, total: number}>}
 */
export async function getAllDesigners(options = {}) {
  const {
    specialty,
    minRating = 0,
    search = "",
    sortBy = "rating",
    pageLimit = 20
  } = options;

  try {
    const designersRef = collection(db, "designers");
    const constraints = [where("verified", "==", true)];

    // Add specialty filter if provided
    if (specialty) {
      constraints.push(where("specialties", "array-contains", specialty));
    }

    // Add rating filter if provided
    if (minRating > 0) {
      constraints.push(where("rating", ">=", minRating));
    }

    // Add sorting
    const sortMap = {
      rating: ["rating", "desc"],
      name: ["name", "asc"],
      experience: ["yearsExperience", "desc"],
      price: ["hourlyRate", "asc"]
    };

    const [sortField, sortDir] = sortMap[sortBy] || ["rating", "desc"];
    constraints.push(orderBy(sortField, sortDir));
    constraints.push(limit(pageLimit));

    const q = query(designersRef, ...constraints);
    const snapshot = await getDocs(q);

    let designers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side search filter
    if (search) {
      const searchLower = search.toLowerCase();
      designers = designers.filter(designer =>
        designer.name?.toLowerCase().includes(searchLower) ||
        designer.specialties?.some(s => s.toLowerCase().includes(searchLower)) ||
        designer.location?.toLowerCase().includes(searchLower)
      );
    }

    return {
      designers,
      total: designers.length
    };
  } catch (err) {
    console.error("Error fetching designers:", err);
    return { designers: [], total: 0 };
  }
}

/**
 * Get a specific designer by ID with full details
 * @param {string} designerId - Designer document ID
 * @returns {Promise<Object>}
 */
export async function getDesignerById(designerId) {
  try {
    const docRef = doc(db, "designers", designerId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("Designer not found");
    }

    const designer = {
      id: snapshot.id,
      ...snapshot.data()
    };

    // Could fetch portfolio images, project count, etc.
    // For now, return basic designer info
    return designer;
  } catch (err) {
    console.error("Error fetching designer:", err);
    throw err;
  }
}

/**
 * Advanced search with multiple filter options
 * @param {Object} filters - Search and filter parameters
 * @param {string} filters.keyword - Search keyword (client-side)
 * @param {string} filters.specialty - Filter by specialty
 * @param {number} filters.minPrice - Minimum hourly rate
 * @param {number} filters.maxPrice - Maximum hourly rate
 * @param {number} filters.minRating - Minimum rating
 * @param {number} filters.minExperience - Minimum years of experience
 * @param {string} filters.location - Location filter (client-side)
 * @param {string} filters.sortBy - Sort by (rating|name|experience|price)
 * @param {number} filters.pageLimit - Max results
 * @returns {Promise<Array>}
 */
export async function searchDesigners(filters = {}) {
  const {
    keyword = "",
    specialty,
    minPrice = 0,
    maxPrice = 999,
    minRating = 0,
    minExperience = 0,
    location = "",
    sortBy = "rating",
    pageLimit = 20
  } = filters;

  try {
    const designersRef = collection(db, "designers");
    const constraints = [where("verified", "==", true)];

    // Server-side filters
    if (specialty) {
      constraints.push(where("specialties", "array-contains", specialty));
    }

    if (minRating > 0) {
      constraints.push(where("rating", ">=", minRating));
    }

    if (minExperience > 0) {
      constraints.push(where("yearsExperience", ">=", minExperience));
    }

    // Sorting
    const sortMap = {
      rating: ["rating", "desc"],
      name: ["name", "asc"],
      experience: ["yearsExperience", "desc"],
      price: ["hourlyRate", "asc"]
    };

    const [sortField, sortDir] = sortMap[sortBy] || ["rating", "desc"];
    constraints.push(orderBy(sortField, sortDir));
    constraints.push(limit(pageLimit));

    const q = query(designersRef, ...constraints);
    const snapshot = await getDocs(q);

    let designers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side filters (for fields that Firestore can't efficiently filter)
    designers = designers.filter(designer => {
      // Price range filter
      if (designer.hourlyRate < minPrice || designer.hourlyRate > maxPrice) {
        return false;
      }

      // Keyword search
      if (keyword) {
        const searchLower = keyword.toLowerCase();
        const matchesKeyword =
          designer.name?.toLowerCase().includes(searchLower) ||
          designer.specialties?.some(s => s.toLowerCase().includes(searchLower)) ||
          designer.bio?.toLowerCase().includes(searchLower);
        if (!matchesKeyword) return false;
      }

      // Location filter
      if (location) {
        const locationMatch = designer.location
          ?.toLowerCase()
          .includes(location.toLowerCase());
        if (!locationMatch) return false;
      }

      return true;
    });

    return designers;
  } catch (err) {
    console.error("Error searching designers:", err);
    return [];
  }
}

/**
 * Get designers filtered by specialty
 * @param {string} specialty - Design specialty
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
export async function getDesignersBySpecialty(specialty, pageLimit = 20) {
  try {
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      where("specialties", "array-contains", specialty),
      orderBy("rating", "desc"),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching designers by specialty:", err);
    return [];
  }
}

/**
 * Get top-rated designers
 * @param {number} count - Number of designers to return
 * @returns {Promise<Array>}
 */
export async function getTopRatedDesigners(count = 10) {
  try {
    // Only get designers with meaningful number of reviews
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      where("reviewCount", ">=", 5),
      orderBy("rating", "desc"),
      limit(count)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching top-rated designers:", err);
    // Fallback: get by rating without review count filter
    try {
      const designersRef = collection(db, "designers");
      const q = query(
        designersRef,
        where("verified", "==", true),
        orderBy("rating", "desc"),
        limit(count)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackErr) {
      console.error("Fallback error:", fallbackErr);
      return [];
    }
  }
}

/**
 * Get designers within a price range
 * @param {number} minPrice - Minimum hourly rate
 * @param {number} maxPrice - Maximum hourly rate
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
export async function getDesignersByPriceRange(minPrice, maxPrice, pageLimit = 20) {
  try {
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      where("hourlyRate", ">=", minPrice),
      where("hourlyRate", "<=", maxPrice),
      orderBy("hourlyRate", "asc"),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching designers by price range:", err);
    // Firestore compound query limitation - try alternative approach
    const all = await getAllDesigners({ pageLimit: 100 });
    return all.designers
      .filter(d => d.hourlyRate >= minPrice && d.hourlyRate <= maxPrice)
      .sort((a, b) => a.hourlyRate - b.hourlyRate)
      .slice(0, pageLimit);
  }
}

/**
 * Get all available specialties for filter dropdowns
 * @returns {Promise<Array>}
 */
export async function getAvailableSpecialties() {
  try {
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      limit(100) // Get enough to find all specialties
    );

    const snapshot = await getDocs(q);
    const specialties = new Set();

    snapshot.docs.forEach(doc => {
      const designer = doc.data();
      if (Array.isArray(designer.specialties)) {
        designer.specialties.forEach(spec => specialties.add(spec));
      }
    });

    return Array.from(specialties).sort();
  } catch (err) {
    console.error("Error fetching specialties:", err);
    // Return default specialties if query fails
    return [
      "Bridal",
      "Casual Wear",
      "Evening Wear",
      "Formal Wear",
      "Kids Fashion",
      "Menswear",
      "Tailoring",
      "Vintage",
      "Wedding",
      "Streetwear"
    ];
  }
}

/**
 * Get personalized designer suggestions for a customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>}
 */
export async function getDesignerSuggestions(customerId) {
  try {
    // Future: Could analyze customer's order history to recommend similar designers
    // For now, return top-rated designers as suggestions
    return await getTopRatedDesigners(5);
  } catch (err) {
    console.error("Error getting designer suggestions:", err);
    return [];
  }
}

/**
 * Compare multiple designers side-by-side
 * @param {Array} designerIds - Array of designer IDs to compare
 * @returns {Promise<Object>}
 */
export async function compareDesigners(designerIds = []) {
  try {
    const designers = [];

    // Fetch each designer
    for (const id of designerIds) {
      try {
        const designer = await getDesignerById(id);
        designers.push(designer);
      } catch (err) {
        console.warn(`Could not fetch designer ${id}:`, err);
      }
    }

    // Calculate comparison stats
    const comparison = {
      designers,
      stats: {
        avgRating: designers.length > 0
          ? (designers.reduce((sum, d) => sum + (d.rating || 0), 0) / designers.length).toFixed(1)
          : 0,
        avgPrice: designers.length > 0
          ? (designers.reduce((sum, d) => sum + (d.hourlyRate || 0), 0) / designers.length).toFixed(0)
          : 0,
        avgExperience: designers.length > 0
          ? (designers.reduce((sum, d) => sum + (d.yearsExperience || 0), 0) / designers.length).toFixed(1)
          : 0,
        totalReviews: designers.reduce((sum, d) => sum + (d.reviewCount || 0), 0)
      }
    };

    return comparison;
  } catch (err) {
    console.error("Error comparing designers:", err);
    return { designers: [], stats: {} };
  }
}

export default {
  getAllDesigners,
  getDesignerById,
  searchDesigners,
  getDesignersBySpecialty,
  getTopRatedDesigners,
  getDesignersByPriceRange,
  getAvailableSpecialties,
  getDesignerSuggestions,
  compareDesigners
};
