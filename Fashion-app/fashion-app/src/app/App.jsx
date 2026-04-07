import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes.jsx";
import './firebaseConfig.js';
import { useState, useEffect } from "react";

export default function App() {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (event) => {
      console.error("Error caught:", event);
      setHasError(true);
    };
    
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fee",
        color: "#c33",
        fontFamily: "monospace",
        padding: "20px",
        textAlign: "center"
      }}>
        <h1>An error occurred. Check the console for details.</h1>
      </div>
    );
  }

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}