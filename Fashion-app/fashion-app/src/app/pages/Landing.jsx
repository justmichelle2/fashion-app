import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DrssedLogo from "../components/DressedLogo";
import { Sparkles, Users, Shirt, MessageCircle, ArrowRight, Scissors } from "lucide-react";
import RoleSelector from "../components/RoleSelector";

export default function Landing() {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [roleMode, setRoleMode] = useState("signup");

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: "Custom Designs", description: "Get unique, tailor-made clothing that fits your style" },
    { icon: <Users className="w-6 h-6" />, title: "Expert Tailors", description: "Connect with Ghana's finest designers and tailors" },
    { icon: <Shirt className="w-6 h-6" />, title: "Perfect Fit", description: "Upload measurements for garments that fit perfectly" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "Direct Chat", description: "Communicate directly with your designer" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F5E6D3]/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="flex flex-col items-center gap-6 mb-12">
          <DrssedLogo size={120} />
          <div className="text-center">
            <h1 className="text-[#2D2D2D] mb-2 text-[56px] font-bold font-['Playfair_Display'] tracking-wide">drssed</h1>
            <p className="text-[#6B6B6B] text-lg font-['Raleway'] tracking-[0.08em] font-medium">Where Fashion Meets Art</p>
          </div>
        </div>

        <p className="text-center text-[#2D2D2D] mb-12 px-4 text-[15px] leading-relaxed font-['Raleway']">
          Your gateway to Ghana's finest custom fashion designers and tailors.<br/>Bespoke elegance, crafted to perfection.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-[#E76F51]/10 hover:shadow-md transition-shadow hover:border-[#E76F51]/30">
              <div className="text-[#E76F51] mb-3">{feature.icon}</div>
              <h3 className="mb-1 text-sm font-semibold font-['Raleway']">{feature.title}</h3>
              <p className="text-[#6B6B6B] text-xs leading-snug font-['Raleway']">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={() => {
            setRoleMode("signup");
            setShowRoleSelection(true);
          }}
          className="w-full h-14 bg-[#E76F51] hover:bg-[#D55B3A] text-white rounded-full shadow-lg text-base font-semibold font-['Raleway']"
        >
          Get Started
        </button>
        <button
          onClick={() => {
            setRoleMode("login");
            setShowRoleSelection(true);
          }}
          className="w-full h-14 border-2 border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D]/5 rounded-full text-base font-semibold font-['Raleway']"
        >
          Sign In
        </button>
      </div>

      <RoleSelector open={showRoleSelection} mode={roleMode} onClose={() => setShowRoleSelection(false)} />
    </div>
  );
}