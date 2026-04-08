import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

const FALLBACK_PASSWORD_POLICY = {
  minLength: 6,
  requiresLowercase: false,
  requiresUppercase: false,
  requiresNumber: false,
  requiresSpecialCharacter: false,
};

let cachedPasswordPolicy = null;
let passwordPolicyRequestPromise = null;

const getUserProfileByUid = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap.exists() ? userDocSnap.data() : null;
};

const getRoleFromProfile = (profile) => {
  if (!profile || typeof profile !== "object") {
    return "customer";
  }

  return profile.userType || profile.role || "customer";
};

const validatePasswordWithRules = (password, rules) => {
  const issues = [];
  const effectiveRules = rules || FALLBACK_PASSWORD_POLICY;

  if ((password || "").length < effectiveRules.minLength) {
    issues.push(`Password must be at least ${effectiveRules.minLength} characters long`);
  }
  if (effectiveRules.requiresLowercase && !/[a-z]/.test(password)) {
    issues.push("Password must contain a lowercase letter (a-z)");
  }
  if (effectiveRules.requiresUppercase && !/[A-Z]/.test(password)) {
    issues.push("Password must contain an uppercase letter (A-Z)");
  }
  if (effectiveRules.requiresNumber && !/[0-9]/.test(password)) {
    issues.push("Password must contain a number (0-9)");
  }
  if (effectiveRules.requiresSpecialCharacter && !/[^A-Za-z0-9]/.test(password)) {
    issues.push("Password must contain a special character (!@#$%^&*)");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

const getQuotaFallbackMessage = () =>
  "Password policy could not be loaded because Firebase quota was exceeded. Using fallback rule: password must be at least 6 characters long.";

export const loadPasswordPolicy = async () => {
  if (cachedPasswordPolicy) {
    return {
      success: true,
      policy: cachedPasswordPolicy,
      source: "fallback",
      message: null,
    };
  }

  if (!passwordPolicyRequestPromise) {
    // Keep validation local because this Firebase SDK build does not expose getPasswordPolicy.
    passwordPolicyRequestPromise = Promise.resolve()
      .then(() => {
        cachedPasswordPolicy = { ...FALLBACK_PASSWORD_POLICY };
        return {
          success: true,
          policy: cachedPasswordPolicy,
          source: "fallback",
          message: null,
        };
      })
      .finally(() => {
        passwordPolicyRequestPromise = null;
      });
  }

  return passwordPolicyRequestPromise;
};

const getFirebaseAuthErrorMessage = (error, fallbackMessage) => {
  if (error?.code === "auth/quota-exceeded") {
    return "Firebase request quota has been exceeded. Please try again later or check Firebase Usage & Quotas.";
  }

  if (error?.code === "auth/network-request-failed") {
    return "Firebase Authentication could not reach the network. Check your internet connection, firewall/proxy, and make sure localhost is authorized in Firebase Authentication settings.";
  }

  if (error?.code === "auth/email-already-in-use") {
    return "This email is already registered";
  }

  if (error?.code === "auth/invalid-email") {
    return "Invalid email address";
  }

  if (error?.code === "auth/weak-password") {
    return "Password is too weak";
  }

  if (error?.code === "auth/user-not-found") {
    return "User not found. Please check your email";
  }

  if (error?.code === "auth/wrong-password") {
    return "Incorrect password";
  }

  if (error?.code === "auth/user-disabled") {
    return "This account has been disabled";
  }

  if (error?.code === "auth/invalid-credential") {
    return "Invalid email or password. Double-check your credentials and try again.";
  }

  if (error?.code === "auth/popup-closed-by-user") {
    return "Sign-in was cancelled";
  }

  return error?.message || fallbackMessage;
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {Promise<{isValid: boolean, issues: string[]}>}
 */
export const handleValidatePassword = async (password) => {
  try {
    if (!password) {
      return { 
        isValid: false, 
        issues: ["Password is required"] 
      };
    }

    const policyResult = await loadPasswordPolicy();
    return validatePasswordWithRules(password, policyResult.policy);
  } catch (error) {
    console.error("Password validation error:", error);

    if (error?.code === "auth/quota-exceeded") {
      return {
        isValid: (password || "").length >= FALLBACK_PASSWORD_POLICY.minLength,
        issues:
          (password || "").length >= FALLBACK_PASSWORD_POLICY.minLength
            ? []
            : [`Password must be at least ${FALLBACK_PASSWORD_POLICY.minLength} characters long`],
      };
    }

    return { 
      isValid: (password || "").length >= FALLBACK_PASSWORD_POLICY.minLength,
      issues:
        (password || "").length >= FALLBACK_PASSWORD_POLICY.minLength
          ? []
          : [`Password must be at least ${FALLBACK_PASSWORD_POLICY.minLength} characters long`],
    };
  }
};

/**
 * Create user account with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {object} profileData - Additional profile data (name, phone, etc.)
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const handleSignup = async (email, password, profileData = {}) => {
  try {
    // Validate inputs
    if (!email || !password) {
      return { 
        success: false, 
        error: "Email and password are required" 
      };
    }

    // Validate password strength
    const passwordValidation = await handleValidatePassword(password);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        error: passwordValidation.issues.join("\n") 
      };
    }

    // Create user account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore with retry logic
    const userDocRef = doc(db, "users", user.uid);
    const profilePayload = {
      uid: user.uid,
      email: user.email,
      displayName: profileData.name || "",
      phone: profileData.phone || "",
      userType: profileData.userType || "customer",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...profileData
    };
    
    try {
      await setDoc(userDocRef, profilePayload);
      console.log("User profile created successfully in Firestore");
    } catch (firestoreError) {
      console.error("Firestore error during profile creation:", firestoreError);
      // If Firestore write fails, don't fail the entire signup
      // The profile will be created on first login
      console.warn("Profile creation deferred to first login");
    }

    console.log("User account created successfully:", user.email);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: profileData.name || "",
        userType: profileData.userType || "customer",
      }
    };
  } catch (error) {
    console.error("Signup error:", error);

    // If user was created but profile creation failed, try to clean up
    if (error?.code !== "auth/email-already-in-use" && error?.code !== "auth/invalid-email" && 
        error?.code !== "auth/weak-password") {
      try {
        // User creation in Auth succeeded, Firestore failed
        // Don't delete the user - let them login and profile will be created then
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    const errorMessage = getFirebaseAuthErrorMessage(
      error,
      "Unable to create your account right now. Please try again."
    );
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User email or phone
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const handleLogin = async (email, password) => {
  try {
    const normalizedEmail = String(email || "").trim();

    if (!normalizedEmail || !password) {
      return { 
        success: false, 
        error: "Email and password are required" 
      };
    }

    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;
    
    let userProfile = await getUserProfileByUid(user.uid);
    
    // If profile doesn't exist, create a default customer profile
    if (!userProfile) {
      console.warn("User profile not found, creating default profile");
      const userDocRef = doc(db, "users", user.uid);
      const defaultProfile = {
        uid: user.uid,
        email: user.email,
        displayName: "",
        userType: "customer",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await setDoc(userDocRef, defaultProfile);
        userProfile = defaultProfile;
      } catch (firestoreError) {
        console.error("Failed to create user profile during login:", firestoreError);
        userProfile = defaultProfile; // Use in-memory version as fallback
      }
    }
    
    const userType = getRoleFromProfile(userProfile);

    console.log("User logged in successfully:", user.email, "Type:", userType);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        userType,
      }
    };
  } catch (error) {
    console.error("Login error:", error);

    const errorMessage = getFirebaseAuthErrorMessage(
      error,
      "Unable to sign in right now. Please try again."
    );
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists, if not create it
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        userType: "customer",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    const userProfile = userDocSnap.exists() ? userDocSnap.data() : await getUserProfileByUid(user.uid);
    const userType = getRoleFromProfile(userProfile);

    console.log("User signed in with Google:", user.email);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        userType,
      }
    };
  } catch (error) {
    console.error("Google sign-in error:", error);

    const errorMessage = getFirebaseAuthErrorMessage(
      error,
      "Unable to complete Google sign-in right now. Please try again."
    );
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Sign out current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const handleLogout = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully");
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get current user
 * @returns {object|null} Current user object or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
