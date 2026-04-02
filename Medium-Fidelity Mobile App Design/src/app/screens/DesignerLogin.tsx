import { Link, useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";
import { Mail, Lock, Briefcase, TrendingUp, Users, CheckCircle, ArrowLeft } from "lucide-react";

export function DesignerLogin() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
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

        {/* Benefits Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Briefcase className="w-6 h-6 text-[#F4A261] mb-2" />
            <p className="text-[#F5E6D3] text-xs" style={{ fontFamily: "var(--font-body)" }}>Manage Orders</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <TrendingUp className="w-6 h-6 text-[#F4A261] mb-2" />
            <p className="text-[#F5E6D3] text-xs" style={{ fontFamily: "var(--font-body)" }}>Track Earnings</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Users className="w-6 h-6 text-[#F4A261] mb-2" />
            <p className="text-[#F5E6D3] text-xs" style={{ fontFamily: "var(--font-body)" }}>Client Management</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <CheckCircle className="w-6 h-6 text-[#F4A261] mb-2" />
            <p className="text-[#F5E6D3] text-xs" style={{ fontFamily: "var(--font-body)" }}>Portfolio Builder</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Business Email Input */}
            <div>
              <label htmlFor="email" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Business Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="designer@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Password Input */}
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
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#2D2D2D] focus:ring-[#2D2D2D]"
                />
                <span className="text-sm text-[#6B6B6B]" style={{ fontFamily: "var(--font-body)" }}>Remember me</span>
              </label>
              <button type="button" className="text-[#E76F51] text-sm" style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-lg hover:bg-[#1D1D1D] hover:shadow-lg transition-all"
              style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
            >
              Access Dashboard
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E76F51]/10"></div>
            <span className="text-[#6B6B6B] text-sm" style={{ fontFamily: "var(--font-body)" }}>New Designer?</span>
            <div className="flex-1 h-px bg-[#E76F51]/10"></div>
          </div>

          {/* Register Link */}
          <Link 
            to="/designer-signup"
            className="block w-full text-center py-3.5 bg-[#E76F51] hover:bg-[#D55B3A] text-white rounded-lg transition-all shadow-sm"
            style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
          >
            Register Your Business
          </Link>
        </div>

        {/* Back to Customer */}
        <div className="mt-6 text-center">
          <Link to="/landing" className="text-[#F5E6D3]/80 hover:text-[#F5E6D3] text-sm" style={{ fontFamily: "var(--font-body)" }}>
            ← Back to main page
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 pb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-[#F5E6D3] text-center text-sm mb-2" style={{ fontWeight: "600", fontFamily: "var(--font-heading)" }}>
            Join Ghana's Premier Fashion Network
          </p>
          <p className="text-[#F5E6D3]/80 text-center text-xs" style={{ fontFamily: "var(--font-body)" }}>
            Connect with thousands of customers looking for bespoke designs
          </p>
        </div>
      </div>
    </div>
  );
}