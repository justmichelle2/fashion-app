import { Link, useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";
import { Mail, Lock, Chrome, Apple, ArrowLeft } from "lucide-react";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - navigate to customer home
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
      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-[#2D2D2D] mb-2 text-[32px] font-bold font-['Playfair_Display']">
            Welcome Back
          </h1>
          <p className="text-[#6B6B6B] font-['Raleway']">Sign in to continue to drssed</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-[#2D2D2D] mb-2 font-['Raleway'] font-medium">
              Email or Phone
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
              <input
                id="email"
                type="text"
                placeholder="Enter email or phone"
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
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent font-['Raleway']"
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button type="button" className="text-[#E76F51] text-sm font-['Raleway'] font-medium">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#E76F51] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold font-['Raleway']"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#E76F51]/10"></div>
          <span className="text-[#6B6B6B] text-sm font-['Raleway']">Or continue with</span>
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

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-[#6B6B6B] font-['Raleway']">Don't have an account? </span>
          <Link to="/signup" className="text-[#E76F51] font-semibold font-['Raleway']">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}