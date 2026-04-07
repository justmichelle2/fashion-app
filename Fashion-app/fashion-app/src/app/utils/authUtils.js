import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  validatePassword
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

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

    const status = await validatePassword(auth, password);
    
    if (!status.isValid) {
      const issues = [];
      
      if (status.containsLowercaseLetter !== true) {
        issues.push("Password must contain a lowercase letter (a-z)");
      }
      if (status.containsUppercaseLetter !== true) {
        issues.push("Password must contain an uppercase letter (A-Z)");
      }
      if (status.containsNumericCharacter !== true) {
        issues.push("Password must contain a number (0-9)");
      }
      if (status.containsNonAlphanumericCharacter !== true) {
        issues.push("Password must contain a special character (!@#$%^&*)");
      }
      if (status.meetsMinPasswordLength !== true) {
        issues.push("Password must be at least 6 characters long");
      }
      
      return { isValid: false, issues };
    }
    
    return { isValid: true, issues: [] };
  } catch (error) {
    console.error("Password validation error:", error);
    return { 
      isValid: false, 
      issues: [error.message || "Error validating password"] 
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

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: profileData.name || "",
      phone: profileData.phone || "",
      userType: profileData.userType || "customer", // customer or designer
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...profileData
    });

    console.log("User account created successfully:", user.email);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: profileData.name || ""
      }
    };
  } catch (error) {
    console.error("Signup error:", error);
    
    let errorMessage = error.message;
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak";
    }
    
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
    if (!email || !password) {
      return { 
        success: false, 
        error: "Email and password are required" 
      };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User logged in successfully:", user.email);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    
    let errorMessage = error.message;
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found. Please check your email";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/user-disabled") {
      errorMessage = "This account has been disabled";
    }
    
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
    const userDocSnap = await import("firebase/firestore").then(m => m.getDoc(userDocRef));
    
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

    console.log("User signed in with Google:", user.email);
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    
    let errorMessage = error.message;
    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Sign-in was cancelled";
    }
    
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
