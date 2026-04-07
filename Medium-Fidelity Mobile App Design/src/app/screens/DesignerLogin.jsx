import { Link, useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";
import { Mail, Lock, Briefcase, TrendingUp, Users, CheckCircle, ArrowLeft } from "lucide-react";

export function DesignerLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - navigate to designer dashboard
    navigate("/designer-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 py-6 px-6">
        <div className="flex items-center justify-between">
          <Link to="/landing" className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ArrowLeft size={24} className="text-white" />
          </Link>
          <DrssedLogo size={60} className="drop-shadow-lg" />
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-[#F5E6D3] mb-2" style={{ fontSize: "32px", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
            Designer Portal
          </h1>
          <p className="text-[#F5E6D3]/80" style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}>
            Manage your business and grow your clientele
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-[#F4A261]/20 to-[#E76F51]/20 rounded-2xl p-6 mb-8 border border-white/10">
          <h3 className="text-[#F5E6D3] mb-4" style={{ fontSize: "16px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
            Designer Benefits
          </h3>
          <div className="space-y-3">
            {[
              { icon: <Users />, text: "Connect with customers across Ghana" },
              { icon: <Briefcase />, text: "Manage orders and track earnings" },
              { icon: <TrendingUp />, text: "Grow your business with analytics" },
              { icon: <CheckCircle />, text: "Secure payments via Paystack & MTN MoMo" }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="text-[#F4A261]" style={{ width: "20px", height: "20px" }}>
                  {benefit.icon}
                </div>
                <span className="text-[#F5E6D3]/90 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="designer@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-[#2D2D2D] text-sm hover:text-[#E76F51] transition-colors" style={{ fontFamily: "var(--font-body)", fontWeight: "500" }}>
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-lg hover:bg-[#1D1D1D] hover:shadow-lg transition-all"
              style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
            >
              Sign In to Designer Portal
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E76F51]/10"></div>
            <span className="text-[#6B6B6B] text-sm" style={{ fontFamily: "var(--font-body)" }}>New Designer?</span>
            <div className="flex-1 h-px bg-[#E76F51]/10"></div>
          </div>

          <Link
            to="/designer-signup"
            className="block w-full text-center py-3 bg-[#E76F51]/10 hover:bg-[#E76F51]/20 text-[#2D2D2D] rounded-lg transition-all"
            style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
          >
            Create Designer Account
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link to="/landing" className="text-[#F5E6D3]/80 hover:text-[#F5E6D3] text-sm" style={{ fontFamily: "var(--font-body)" }}>
            ← Back to main page
          </Link>
        </div>
      </div>
    </div>
  );
}
