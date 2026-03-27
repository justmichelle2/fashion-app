import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-gradient-to-tr from-primary to-accent flex flex-col items-center justify-center text-white px-6">

      {/* Logo Placeholder */}
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce">
        <span className="text-primary text-3xl animate-bounce">🐝</span>
      </div>

      <h1 className="text-2xl font-bold text-center">
        DRSSED
      </h1>

      <p className="mt-3 text-center text-sm opacity-90">
        Where Fashion Meets Art
      </p>

    </div>
  );
}
