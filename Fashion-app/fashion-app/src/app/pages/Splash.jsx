import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DressedLogo from "../components/DressedLogo";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #2D2D2D 0%, #3D3D3D 50%, #2D2D2D 100%)",
      padding: "24px",
      margin: 0,
      boxSizing: "border-box"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px"
      }}>
        <DressedLogo size={140} style={{ filter: "drop-shadow(0 25px 50px -12px rgb(0 0 0 / 0.25))" }} />

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "#F5E6D3",
              marginBottom: "8px",
              fontSize: "48px",
              fontWeight: "700",
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "0.02em",
              margin: 0
            }}
          >
            drssed
          </h1>
          
          <p
            style={{
              color: "rgba(245, 230, 211, 0.8)",
              fontSize: "16px",
              fontFamily: "'Cormorant', serif",
              letterSpacing: "0.05em",
              margin: 0
            }}
          >
            Where Fashion Meets Art
          </p>
        </div>
      </div>
    </div>
  );
}