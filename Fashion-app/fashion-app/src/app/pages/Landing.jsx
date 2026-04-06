import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DressedLogo from "../components/DressedLogo";
import { Sparkles, Users, Shirt, MessageCircle, ArrowRight, Scissors } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Custom Designs",
      description: "Get unique, tailor-made clothing that fits your style"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Tailors",
      description: "Connect with Ghana's finest designers and tailors"
    },
    {
      icon: <Shirt className="w-6 h-6" />,
      title: "Perfect Fit",
      description: "Upload measurements for garments that fit perfectly"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Direct Chat",
      description: "Communicate directly with your designer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F5E6D3]/20 flex items-center justify-center px-4 py-10">
      
      <div className="w-full max-w-sm bg-white shadow-2xl p-8 md:p-10 rounded-2xl flex flex-col items-center">

        {/* Logo */}
        <DressedLogo size={80} className="mb-4" />

        {/* Title */}
        <div className="text-center">
          <h1
            className="text-[#2D2D2D] mb-2"
            style={{
              fontSize: "56px",
              fontWeight: "700",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.02em"
            }}
          >
            drssed
          </h1>

          <p
            className="text-[#6B6B6B]"
            style={{
              fontSize: "18px",
              fontFamily: "var(--font-accent)",
              letterSpacing: "0.08em",
              fontWeight: "500"
            }}
          >
            Where Fashion Meets Art
          </p>
        </div>

        {/* Tagline */}
        <p
          className="text-center text-[#2D2D2D] mt-6 mb-8"
          style={{
            fontSize: "15px",
            lineHeight: "1.7",
            fontFamily: "var(--font-body)"
          }}
        >
          Your gateway to Ghana's finest custom fashion designers and tailors.
          <br />
          Bespoke elegance, crafted to perfection.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-[#E76F51]/10 hover:shadow-md transition-shadow hover:border-[#E76F51]/30"
            >
              <div className="text-[#E76F51] mb-2">{feature.icon}</div>
              <h3
                className="mb-1"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: "var(--font-body)"
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-[#6B6B6B]"
                style={{
                  fontSize: "12px",
                  lineHeight: "1.4",
                  fontFamily: "var(--font-body)"
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="w-full space-y-3">
          {!showRoleSelection ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full h-14 bg-[#E76F51] hover:bg-[#D55B3A] text-white rounded-full shadow-lg"
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "var(--font-body)"
                }}
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={() => setShowRoleSelection(true)}
                className="w-full h-14 border-2 border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D]/5 rounded-full"
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "var(--font-body)"
                }}
              >
                Sign In
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p
                className="text-center text-[#6B6B6B] mb-2"
                style={{
                  fontSize: "14px",
                  fontFamily: "var(--font-body)"
                }}
              >
                Choose your account type
              </p>

              {/* Customer */}
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-white border-2 border-[#E76F51] rounded-2xl p-4 hover:bg-[#E76F51]/5 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E76F51] rounded-full flex items-center justify-center">
                      <Shirt className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#2D2D2D] text-sm font-semibold">
                        I'm a Customer
                      </h3>
                      <p className="text-[#6B6B6B] text-xs">
                        Browse and order custom designs
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#E76F51]" />
                </div>
              </button>

              {/* Designer */}
              <button
                onClick={() => navigate("/designer-login")}
                className="w-full bg-white border-2 border-[#2D2D2D] rounded-2xl p-4 hover:bg-[#2D2D2D]/5 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2D2D2D] rounded-full flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#2D2D2D] text-sm font-semibold">
                        I'm a Designer
                      </h3>
                      <p className="text-[#6B6B6B] text-xs">
                        Manage orders and grow your business
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#2D2D2D]" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowRoleSelection(false)}
                className="w-full text-[#6B6B6B] hover:text-[#2D2D2D] text-sm"
              >
                Back
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}