import { Link, useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";
import { Mail, Lock, User, Phone, Chrome, Apple, ArrowLeft } from "lucide-react";

export function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
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
          <h1 className="text-[#2D2D2D] mb-2 text-[32px] font-bold font-['Playfair_Display']">
            Create Account
          </h1>
          <p className="text-[#6B6B6B] font-['Raleway']">Join drssed today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-[#2D2D2D] mb-2 font-['Raleway'] font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent font-['Raleway']"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-[#2D2D2D] mb-2 font-['Raleway'] font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent font-['Raleway']"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-[#2D2D2D] mb-2 font-['Raleway'] font-medium">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="phone"
                type="tel"
                placeholder="+233 XX XXX XXXX"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent font-['Raleway']"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-[#2D2D2D] mb-2 font-['Raleway'] font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="password"
                type="password"
                placeholder="Create password"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent font-['Raleway']"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-[#2D2D2D] mb-3 font-['Raleway']">I am a:</label>
            <div className="bg-[#E76F51]/10 border border-[#E76F51]/30 rounded-lg p-3">
              <p className="text-sm text-center text-[#6B6B6B] font-['Raleway']">
                Signing up as <span className="text-[#E76F51] font-semibold">Customer</span>
              </p>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-2 text-center font-['Raleway']">
              Designer? <Link to="/designer-signup" className="text-[#2D2D2D] font-semibold">Register here</Link>
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#E76F51] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold font-['Raleway']"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#E76F51]/10"></div>
          <span className="text-[#6B6B6B] text-sm font-['Raleway']">Or sign up with</span>
          <div className="flex-1 h-px bg-[#E76F51]/10"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E76F51]/20 rounded-lg hover:bg-[#FAFAF8] transition-colors">
            <Chrome size={20} className="text-[#2D2D2D]" />
            <span className="text-[#2D2D2D] font-['Raleway']">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E76F51]/20 rounded-lg hover:bg-[#FAFAF8] transition-colors">
            <Apple size={20} className="text-[#2D2D2D]" />
            <span className="text-[#2D2D2D] font-['Raleway']">Apple</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mb-6">
          <span className="text-[#6B6B6B] font-['Raleway']">Already have an account? </span>
          <Link to="/login" className="text-[#E76F51] font-semibold font-['Raleway']">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}