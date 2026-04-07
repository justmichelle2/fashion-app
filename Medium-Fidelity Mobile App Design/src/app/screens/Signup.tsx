import { Link, useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";
import { Mail, Lock, User, Phone, Chrome, Apple, ArrowLeft } from "lucide-react";

export function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E76F51]/10 py-6 px-6">
        <div className="flex items-center justify-between">
          <Link to="/landing" className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </Link>
          <DrssedLogo size={60} />
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-[#2D2D2D] mb-2" style={{ fontSize: "32px", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
            Create Account
          </h1>
          <p className="text-[#6B6B6B]" style={{ fontFamily: "var(--font-body)" }}>Join drssed today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-[#2D2D2D] mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: "500" }}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-[#2D2D2D] mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: "500" }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-[#2D2D2D] mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: "500" }}>
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="phone"
                type="tel"
                placeholder="+233 XX XXX XXXX"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-[#2D2D2D] mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: "500" }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="password"
                type="password"
                placeholder="Create password"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-[#2D2D2D] mb-3" style={{ fontFamily: "var(--font-body)" }}>I am a:</label>
            <div className="bg-[#E76F51]/10 border border-[#E76F51]/30 rounded-lg p-3">
              <p className="text-sm text-center text-[#6B6B6B]" style={{ fontFamily: "var(--font-body)" }}>
                Signing up as <span className="text-[#E76F51]" style={{ fontWeight: "600" }}>Customer</span>
              </p>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-2 text-center" style={{ fontFamily: "var(--font-body)" }}>
              Designer? <Link to="/designer-signup" className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>Register here</Link>
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#E76F51] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm"
            style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#E76F51]/10"></div>
          <span className="text-[#6B6B6B] text-sm" style={{ fontFamily: "var(--font-body)" }}>Or sign up with</span>
          <div className="flex-1 h-px bg-[#E76F51]/10"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E76F51]/20 rounded-lg hover:bg-[#FAFAF8] transition-colors">
            <Chrome size={20} className="text-[#2D2D2D]" />
            <span className="text-[#2D2D2D]" style={{ fontFamily: "var(--font-body)" }}>Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E76F51]/20 rounded-lg hover:bg-[#FAFAF8] transition-colors">
            <Apple size={20} className="text-[#2D2D2D]" />
            <span className="text-[#2D2D2D]" style={{ fontFamily: "var(--font-body)" }}>Apple</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mb-6">
          <span className="text-[#6B6B6B]" style={{ fontFamily: "var(--font-body)" }}>Already have an account? </span>
          <Link to="/login" className="text-[#E76F51]" style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}