import { getApp, getApps, initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Fallback keeps the app running if .env is not configured yet.
const firebaseConfig = {
  apiKey: envConfig.apiKey || "AIzaSyAXNSgViiorRBNB11VgZozq2fWNtZt8jig",
  authDomain: envConfig.authDomain || "fashion-app-a5b92.firebaseapp.com",
  projectId: envConfig.projectId || "fashion-app-a5b92",
  storageBucket: envConfig.storageBucket || "fashion-app-a5b92.firebasestorage.app",
  messagingSenderId: envConfig.messagingSenderId || "396549646617",
  appId: envConfig.appId || "1:396549646617:web:e26dffc72f0c59ee9abd88",
  measurementId: envConfig.measurementId || "G-LZR6C7GQ37",
};

// Reuse existing app instance to avoid duplicate initialization in HMR/multiple imports.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const authPersistenceReady = setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Auth persistence setup error:", error);
});

export { auth, authPersistenceReady };
