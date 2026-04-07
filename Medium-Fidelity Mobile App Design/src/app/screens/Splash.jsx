import { useEffect } from "react";
import { useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2D2D2D] via-[#3D3D3D] to-[#2D2D2D] p-6">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <DrssedLogo size={140} className="drop-shadow-2xl" />
        <div className="text-center">
          <h1 className="text-[#F5E6D3] mb-2 text-5xl font-bold font-['Playfair_Display'] tracking-wide">
            drssed
          </h1>
          <p className="text-[#F5E6D3]/80 text-base font-['Raleway'] tracking-widest">
            Where Fashion Meets Art
          </p>
        </div>
      </div>
    </div>
  );
}