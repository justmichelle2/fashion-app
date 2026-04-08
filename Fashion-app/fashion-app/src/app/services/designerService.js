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
    // Query from users collection (new designers)
    const usersRef = collection(db, "users");
    const userConstraints = [where("userType", "==", "designer")];
    
    if (minRating > 0) {
      userConstraints.push(where("rating", ">=", minRating));
    }

    // Don't use orderBy in the query - do sorting client-side for reliability
    // This avoids Firestore index issues and works with missing fields
    userConstraints.push(limit(100)); // Get more docs for client-side filtering

    const usersQuery = query(usersRef, ...userConstraints);
    const usersSnapshot = await getDocs(usersQuery);
    
    console.log(`[getAllDesigners] Query params - sortBy: ${sortBy}, minRating: ${minRating}`);
    console.log(`[getAllDesigners] Found ${usersSnapshot.docs.length} designers from users collection`);
    
    let designers = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`[getAllDesigners] Designer doc:`, {
        id: doc.id,
        name: data.businessName || data.name,
        userType: data.userType,
        rating: data.rating,
        specialties: data.specialties
      });
      return {
        id: doc.id,
        name: data.businessName || data.name || "Designer",
        location: data.location || "",
        rating: data.rating || 5,
        reviewCount: data.reviewCount || 0,
        verified: true,
        specialties: data.specialties || [],
        profilePicture: data.profilePicture || "",
        phone: data.phone || "",
        businessName: data.businessName || "",
        description: data.description || "",
        yearsExperience: data.yearsExperience || 0,
        hourlyRate: data.hourlyRate || 0,
        portfolio: data.portfolio || []
      };
    });

    // Apply client-side filtering for specialty
    if (specialty) {
      designers = designers.filter(d => 
        Array.isArray(d.specialties) && d.specialties.includes(specialty)
      );
    }

    // Apply client-side search
    if (search) {
      const searchLower = search.toLowerCase();
      designers = designers.filter(designer =>
        designer.name?.toLowerCase().includes(searchLower) ||
        designer.businessName?.toLowerCase().includes(searchLower) ||
        designer.specialties?.some(s => s?.toLowerCase().includes(searchLower)) ||
        designer.location?.toLowerCase().includes(searchLower)
      );
    }

    // Sort client-side
    const sortMap = {
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
      name: (a, b) => (a.businessName || a.name || "").localeCompare(b.businessName || b.name || ""),
      experience: (a, b) => (b.yearsExperience || 0) - (a.yearsExperience || 0),
      price: (a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0)
    };

    const sortFn = sortMap[sortBy] || sortMap.rating;
    designers.sort(sortFn);

    console.log(`[getAllDesigners] Final designers count: ${designers.length}`);
    return {
      designers: designers.slice(0, pageLimit),
      total: designers.length
    };
  } catch (err) {
    console.error("[getAllDesigners] Error fetching designers:", err);
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
    // First try to get from users collection (new designers)
    const userDocRef = doc(db, "users", designerId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists() && userSnapshot.data().userType === "designer") {
      const data = userSnapshot.data();
      return {
        id: userSnapshot.id,
        name: data.businessName || data.name || "Designer",
        businessName: data.businessName || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        rating: data.rating || 5,
        reviewCount: data.reviewCount || 0,
        verified: true,
        specialties: data.specialties || [],
        profilePicture: data.profilePicture || "",
        yearsExperience: data.yearsExperience || 0,
        hourlyRate: data.hourlyRate || 0,
        portfolio: data.portfolio || [],
        description: data.description || "",
        createdAt: data.createdAt
      };
    }

    // Fall back to designers collection (legacy designers)
    const docRef = doc(db, "designers", designerId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("Designer not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    };
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
    // Query both collections
    const designersRef = collection(db, "designers");
    const usersRef = collection(db, "users");

    // Legacy designers from designers collection
    const constraints = [where("verified", "==", true)];
    if (specialty) {
      constraints.push(where("specialties", "array-contains", specialty));
    }
    if (minRating > 0) {
      constraints.push(where("rating", ">=", minRating));
    }
    if (minExperience > 0) {
      constraints.push(where("yearsExperience", ">=", minExperience));
    }

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

    // New designers from users collection
    const userConstraints = [where("userType", "==", "designer")];
    if (minRating > 0) {
      userConstraints.push(where("rating", ">=", minRating));
    }
    userConstraints.push(orderBy(sortField === "name" ? "businessName" : sortField, sortDir));
    userConstraints.push(limit(pageLimit));

    const usersQuery = query(usersRef, ...userConstraints);
    const usersSnapshot = await getDocs(usersQuery);

    const userDesigners = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.businessName || data.name || "Designer",
        businessName: data.businessName || "",
        location: data.location || "",
        rating: data.rating || 5,
        reviewCount: data.reviewCount || 0,
        verified: true,
        specialties: data.specialties || [],
        profilePicture: data.profilePicture || "",
        hourlyRate: data.hourlyRate || 0,
        yearsExperience: data.yearsExperience || 0
      };
    });

    designers = [...designers, ...userDesigners];

    // Remove duplicates
    const seen = new Set();
    designers = designers.filter(d => {
      if (seen.has(d.id)) return false;
      seen.add(d.id);
      return true;
    });

    // Client-side filters
    designers = designers.filter(designer => {
      // Specialty filter
      if (specialty && !designer.specialties?.some(s => s?.toLowerCase() === specialty.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (designer.hourlyRate && (designer.hourlyRate < minPrice || designer.hourlyRate > maxPrice)) {
        return false;
      }

      // Keyword search
      if (keyword) {
        const searchLower = keyword.toLowerCase();
        const matchesKeyword =
          designer.name?.toLowerCase().includes(searchLower) ||
          designer.businessName?.toLowerCase().includes(searchLower) ||
          designer.specialties?.some(s => s?.toLowerCase().includes(searchLower)) ||
          designer.bio?.toLowerCase().includes(searchLower);
        if (!matchesKeyword) return false;
      }

      // Location filter
      if (location) {
        const locationMatch = designer.location?.toLowerCase().includes(location.toLowerCase());
        if (!locationMatch) return false;
      }

      return true;
    });

    return designers.slice(0, pageLimit);
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
    // Query from designers collection
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      where("specialties", "array-contains", specialty),
      orderBy("rating", "desc"),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    let designers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Query from users collection
    const usersRef = collection(db, "users");
    const usersQuery = query(
      usersRef,
      where("userType", "==", "designer"),
      orderBy("rating", "desc"),
      limit(pageLimit)
    );

    const usersSnapshot = await getDocs(usersQuery);
    const userDesigners = usersSnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return data.specialties?.some(s => s?.toLowerCase() === specialty?.toLowerCase());
      })
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.businessName || data.name || "Designer",
          businessName: data.businessName || "",
          location: data.location || "",
          rating: data.rating || 5,
          reviewCount: data.reviewCount || 0,
          verified: true,
          specialties: data.specialties || [],
          profilePicture: data.profilePicture || ""
        };
      });

    designers = [...designers, ...userDesigners];

    // Remove duplicates
    const seen = new Set();
    designers = designers.filter(d => {
      if (seen.has(d.id)) return false;
      seen.add(d.id);
      return true;
    });

    return designers.slice(0, pageLimit);
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
    // Query from designers collection
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      orderBy("rating", "desc"),
      limit(count)
    );

    const snapshot = await getDocs(q);
    let designers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Query from users collection
    const usersRef = collection(db, "users");
    const usersQuery = query(
      usersRef,
      where("userType", "==", "designer"),
      orderBy("rating", "desc"),
      limit(count)
    );

    const usersSnapshot = await getDocs(usersQuery);
    const userDesigners = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.businessName || data.name || "Designer",
        businessName: data.businessName || "",
        location: data.location || "",
        rating: data.rating || 5,
        reviewCount: data.reviewCount || 0,
        verified: true,
        specialties: data.specialties || [],
        profilePicture: data.profilePicture || ""
      };
    });

    designers = [...designers, ...userDesigners];

    // Remove duplicates and sort by rating
    const seen = new Set();
    designers = designers.filter(d => {
      if (seen.has(d.id)) return false;
      seen.add(d.id);
      return true;
    });

    designers.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return designers.slice(0, count);
  } catch (err) {
    console.error("Error fetching top-rated designers:", err);
    return [];
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
    const specialties = new Set();

    // Get from designers collection
    const designersRef = collection(db, "designers");
    const q = query(
      designersRef,
      where("verified", "==", true),
      limit(100)
    );

    const snapshot = await getDocs(q);
    snapshot.docs.forEach(doc => {
      const designer = doc.data();
      if (Array.isArray(designer.specialties)) {
        designer.specialties.forEach(spec => specialties.add(spec));
      }
    });

    // Get from users collection
    const usersRef = collection(db, "users");
    const usersQuery = query(
      usersRef,
      where("userType", "==", "designer"),
      limit(100)
    );

    const usersSnapshot = await getDocs(usersQuery);
    usersSnapshot.docs.forEach(doc => {
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
