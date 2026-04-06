import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data());
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      setError(err.message);
      setUserProfile(null);
    }
  };

  // Update user profile in Firestore
  const updateUserProfile = async (profileData) => {
    try {
      if (!currentUser) throw new Error("No user logged in");
      
      const userDocRef = doc(db, "users", currentUser.uid);
      const dataToUpdate = {
        ...profileData,
        updatedAt: serverTimestamp(),
      };
      
      // Try to update, if document doesn't exist, create it
      await setDoc(userDocRef, dataToUpdate, { merge: true });
      
      // Update local state
      setUserProfile(prev => ({ ...prev, ...profileData }));
      setError("");
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    logout,
    updateUserProfile,
    refetchUserProfile: () => {
      if (currentUser) {
        fetchUserProfile(currentUser.uid);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
