import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetch user role from Firestore
 * @param {string} uid - User UID
 * @returns {Promise<string|null>} - Role (Customer/Designer) or null if not found
 */
export async function getUserRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching role for ${uid}:`, error);
    return null;
  }
}

/**
 * Redirect user to appropriate page based on role
 * @param {Object} user - Firebase Auth user
 * @param {Function} navigate - React Router navigate function
 * @param {Object} options - { defaultRole, timeout, onLoading }
 * @returns {Promise<void>}
 */
export async function redirectByRole(user, navigate, options = {}) {
  const { defaultRole = "Customer", timeout = 5000, onLoading } = options;

  if (!user?.uid) {
    console.error("redirectByRole: No authenticated user");
    navigate("/landing");
    return;
  }

  try {
    // Show loading state
    if (onLoading) {
      onLoading(true);
    }

    // Fetch role with timeout
    const rolePromise = getUserRole(user.uid);
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve(null), timeout)
    );
    const role = await Promise.race([rolePromise, timeoutPromise]);

    const userRole = role || defaultRole;
    console.log(`Redirecting user ${user.uid} with role: ${userRole}`);

    // Redirect to appropriate page
    if (userRole === "Designer") {
      navigate("/designer-home");
    } else {
      navigate("/home");
    }
  } catch (error) {
    console.error("Error in redirectByRole:", error);
    // Fallback to default
    navigate(defaultRole === "Designer" ? "/designer-home" : "/home");
  } finally {
    if (onLoading) {
      onLoading(false);
    }
  }
}
