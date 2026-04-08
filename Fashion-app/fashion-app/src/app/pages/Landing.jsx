import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Scissors, Shirt, Sparkles, Users, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.png"; // Wait, pages is inside src/app/pages/ so it's ../../assets/drssed.jpg

export default function Landing() {
  const navigate = useNavigate();
  const [roleSelectionMode, setRoleSelectionMode] = useState(null);

  const roleOptions = {
    signup: [
      {
        title: "Sign up as Customer",
        description: "Create a customer account to browse and order custom designs",
        to: "/customer/signup",
        icon: Shirt,
        iconBg: "bg-[#E76F51]",
        iconText: "text-white",
        chevronText: "text-[#E76F51]",
        borderClass: "border-[#E76F51]",
      },
      {
        title: "Sign up as Designer",
        description: "Create a designer account to manage orders and grow your business",
        to: "/designer/signup",
        icon: Scissors,
        iconBg: "bg-[#2D2D2D]",
        iconText: "text-white",
        chevronText: "text-[#2D2D2D]",
        borderClass: "border-[#2D2D2D]",
      },
    ],
    login: [
      {
        title: "Sign in as Customer",
        description: "Continue to your customer home and track your orders",
        to: "/customer/login",
        icon: Shirt,
        iconBg: "bg-[#E76F51]",
        iconText: "text-white",
        chevronText: "text-[#E76F51]",
        borderClass: "border-[#E76F51]",
      },
      {
        title: "Sign in as Designer",
        description: "Continue to your designer dashboard and manage your business",
        to: "/designer/login",
        icon: Scissors,
        iconBg: "bg-[#2D2D2D]",
        iconText: "text-white",
        chevronText: "text-[#2D2D2D]",
        borderClass: "border-[#2D2D2D]",
      },
    ],
  };

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
          {!roleSelectionMode ? (
            <>
              <button
                onClick={() => setRoleSelectionMode("signup")}
                className="w-full h-14 bg-[#E76F51] hover:bg-[#D55B3A] text-white rounded-full shadow-lg text-[16px] font-semibold transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => setRoleSelectionMode("login")}
                className="w-full h-14 border-2 border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D]/5 rounded-full text-[16px] font-semibold transition-colors"
              >
                Sign In
              </button>
            </>
          ) : (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-[#E76F51]/10 overflow-hidden animate-fade-in">
                <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6B6B6B] font-semibold">
                      Account selection
                    </p>
                    <h2 className="text-xl font-bold text-[#2D2D2D] mt-1">
                      {roleSelectionMode === "signup" ? "Choose how to sign up" : "Choose how to sign in"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setRoleSelectionMode(null)}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Close role selector"
                  >
                    <X className="w-5 h-5 text-[#2D2D2D]" />
                  </button>
                </div>

                <div className="space-y-3 p-4">
                  {roleOptions[roleSelectionMode].map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.to}
                        onClick={() => navigate(option.to)}
                        className={`w-full bg-white border-2 ${option.borderClass} rounded-2xl p-4 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${option.iconBg} rounded-full flex items-center justify-center shrink-0`}>
                              <Icon className={`w-6 h-6 ${option.iconText}`} />
                            </div>
                            <div className="text-left">
                              <h3 className="text-[#2D2D2D] mb-1 text-[16px] font-semibold">
                                {option.title}
                              </h3>
                              <p className="text-[#6B6B6B] text-[13px] leading-relaxed">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className={`w-5 h-5 ${option.chevronText} shrink-0`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => setRoleSelectionMode(null)}
                    className="w-full text-[#6B6B6B] hover:text-[#2D2D2D] text-[14px] py-2 font-semibold"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

