import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Scissors, Shirt, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/drssed.jpg"; // Wait, pages is inside src/app/pages/ so it's ../../assets/drssed.jpg

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col p-6 border border-[#E76F51]/10 h-[90vh] sm:h-auto overflow-y-auto">
        <div className="flex flex-col items-center gap-6 mb-8 mt-4">
          <img src={logo} alt="Drssed Logo" className="w-[120px] h-[120px] object-cover rounded-full shadow-md" />
          <div className="text-center">
            <h1 className="text-[#2D2D2D] mb-2 text-5xl font-bold tracking-tight">
              drssed
            </h1>
            <p className="text-[#6B6B6B] text-lg font-medium tracking-wide">
              Where Fashion Meets Art
            </p>
          </div>
        </div>

        <p className="text-center text-[#2D2D2D] mb-8 px-2 text-[15px] leading-relaxed">
          Your gateway to Ghana's finest custom fashion designers and tailors.<br/>
          Bespoke elegance, crafted to perfection.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-[#E76F51]/10 hover:shadow-md transition-shadow hover:border-[#E76F51]/30"
            >
              <div className="text-[#E76F51] mb-3">
                {feature.icon}
              </div>
              <h3 className="mb-1 text-[14px] font-semibold text-[#2D2D2D]">
                {feature.title}
              </h3>
              <p className="text-[#6B6B6B] text-[12px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full space-y-3 mb-4 mt-auto">
          {!showRoleSelection ? (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="w-full h-14 bg-[#E76F51] hover:bg-[#D55B3A] text-white rounded-full shadow-lg text-[16px] font-semibold transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => setShowRoleSelection(true)}
                className="w-full h-14 border-2 border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D]/5 rounded-full text-[16px] font-semibold transition-colors"
              >
                Sign In
              </button>
            </>
          ) : (
            <div className="space-y-3 animate-fade-in w-full">
              <p className="text-center text-[#6B6B6B] mb-4 text-[14px]">
                Choose your account type
              </p>
              
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-white border-2 border-[#E76F51] rounded-2xl p-5 hover:bg-[#E76F51]/5 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E76F51] rounded-full flex items-center justify-center">
                      <Shirt className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#2D2D2D] mb-1 text-[16px] font-semibold">
                        I'm a Customer
                      </h3>
                      <p className="text-[#6B6B6B] text-[13px]">
                        Browse and order custom designs
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#E76F51]" />
                </div>
              </button>

              <button
                onClick={() => navigate("/designer-login")}
                className="w-full bg-white border-2 border-[#2D2D2D] rounded-2xl p-5 hover:bg-[#2D2D2D]/5 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[#2D2D2D] mb-1 text-[16px] font-semibold">
                        I'm a Designer
                      </h3>
                      <p className="text-[#6B6B6B] text-[13px]">
                        Manage orders and grow your business
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#2D2D2D]" />
                </div>
              </button>

              <button
                onClick={() => setShowRoleSelection(false)}
                className="w-full text-[#6B6B6B] hover:text-[#2D2D2D] text-[14px] py-2 mt-2 font-semibold"
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

