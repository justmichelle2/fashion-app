// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXNSgViiorRBNB11VgZozq2fWNtZt8jig",
  authDomain: "fashion-app-a5b92.firebaseapp.com",
  projectId: "fashion-app-a5b92",
  storageBucket: "fashion-app-a5b92.firebasestorage.app",
  messagingSenderId: "396549646617",
  appId: "1:396549646617:web:e26dffc72f0c59ee9abd88",
  measurementId: "G-LZR6C7GQ37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure auth persistence once at app initialization.
const authPersistenceReady = setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Auth persistence setup error:", error);
});

export { app, auth, db, authPersistenceReady };
