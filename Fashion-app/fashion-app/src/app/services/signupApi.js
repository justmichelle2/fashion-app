import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export async function signupCustomer(payload) {
  const { email, password, name, phone } = payload;

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with name
    await updateProfile(user, { displayName: name });

    // Save customer data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      phone: phone || "",
      userType: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user, success: true };
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    throw new Error(errorMessage);
  }
}

export async function signupDesigner(payload) {
  const { email, password, name, businessName, phone, location } = payload;

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with business name
    await updateProfile(user, { displayName: businessName });

    // Save designer data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      businessName,
      email,
      phone: phone || "",
      location: location || "",
      userType: "designer",
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Initialize designer schedule
    await setDoc(doc(db, "designerSchedules", user.uid), {
      designerId: user.uid,
      workingHours: {
        Monday: { enabled: true, start: "09:00", end: "17:00" },
        Tuesday: { enabled: true, start: "09:00", end: "17:00" },
        Wednesday: { enabled: true, start: "09:00", end: "17:00" },
        Thursday: { enabled: true, start: "09:00", end: "17:00" },
        Friday: { enabled: true, start: "09:00", end: "17:00" },
        Saturday: { enabled: false, start: "10:00", end: "14:00" },
        Sunday: { enabled: false, start: "10:00", end: "14:00" },
      },
      daysOff: [],
      status: "available",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { user, success: true };
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    throw new Error(errorMessage);
  }
}

function getFirebaseErrorMessage(code) {
  const errorMessages = {
    "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed": "Sign up is currently disabled. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your internet connection.",
  };

  return errorMessages[code] || "An error occurred during signup. Please try again.";
}
