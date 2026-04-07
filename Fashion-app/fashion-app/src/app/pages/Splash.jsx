import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DressedLogo from "../components/DressedLogo";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing");
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2D2D2D] via-[#3D3D3D] to-[#2D2D2D] p-6">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <DressedLogo size={140} className="drop-shadow-2xl" />

        <div className="text-center">
          
          <p
            className="text-[#F5E6D3]/80"
            style={{ fontSize: "16px", fontFamily: "var(--font-accent)", letterSpacing: "0.05em" }}
          >
            Where Fashion Meets Art
          </p>
        </div>
      </div>
    </div>
  );
}