import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Sync or create user profile in Firestore after OAuth success.
 * Checks if user exists, handles permission errors gracefully.
 * @param {Object} user - Firebase Auth user object
 * @param {string} provider - Auth provider (google, facebook)
 * @param {Object} overrides - Additional fields to merge (role, etc.)
 */
export async function syncUserToFirestore(user, provider, overrides = {}) {
  if (!user?.uid) {
    console.error("syncUserToFirestore: user.uid is missing");
    throw new Error("User UID is missing");
  }

  const userRef = doc(db, "users", user.uid);

  try {
    // Check if user document exists
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log(`User profile already exists for ${user.uid}. Skipping creation.`);
      return { created: false, user: userSnap.data() };
    }

    // User doesn't exist; create profile
    const userProfile = {
      name: user.displayName || overrides.name || "",
      email: user.email || "",
      photo: user.photoURL || "",
      provider,
      createdAt: serverTimestamp(),
      ...overrides,
    };

    await setDoc(userRef, userProfile, { merge: true });
    console.log(`User profile created successfully for ${user.uid}:`, userProfile);
    return { created: true, user: userProfile };
  } catch (error) {
    const code = error?.code || "";
    const message = error?.message || "";

    if (code === "permission-denied" || message.includes("permission")) {
      console.error(
        `Firestore permission error for ${user.uid}:`,
        `Check your Firestore rules. User must be able to write to users/${user.uid}.`,
        error
      );
      throw new Error(
        "Unable to save your profile. Please check Firestore security rules."
      );
    }

    if (code === "unauthenticated" || message.includes("unauthenticated")) {
      console.error(
        `Auth error when syncing user ${user.uid}:`,
        "User is not authenticated for Firestore write.",
        error
      );
      throw new Error("Authentication expired. Please sign in again.");
    }

    console.error(`Firestore sync error for ${user.uid}:`, error);
    throw error;
  }
}
