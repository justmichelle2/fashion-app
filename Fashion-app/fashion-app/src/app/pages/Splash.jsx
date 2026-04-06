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
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <DressedLogo size={140} className="drop-shadow-2xl" />

        <div className="text-center">
          <h1
            className="text-[#F5E6D3] mb-2"
            style={{
              fontSize: "48px",
              fontWeight: "700",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.02em",
            }}
          >
            drssed
          </h1>

          <p
            className="text-[#F5E6D3]/80"
            style={{
              fontSize: "16px",
              fontFamily: "var(--font-accent)",
              letterSpacing: "0.05em",
            }}
          >
            Where Fashion Meets Art
          </p>
        </div>
      </div>
    </div>
  );
}