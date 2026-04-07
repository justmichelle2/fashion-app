import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import logo from "../../assets/drssed.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[90vh] sm:h-auto pb-6">
        {/* Header */}
        <div className="bg-white border-b border-[#E76F51]/10 py-6 px-6 relative flex items-center justify-center">
          <Link to="/landing" className="absolute left-6 p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </Link>
          <img src={logo} alt="Drssed Logo" className="w-[60px] h-[60px] object-cover rounded-full shadow-sm" />
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pt-8 pb-4 w-full overflow-y-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-[#2D2D2D] mb-2 text-3xl font-bold tracking-tight">
              Create Account
            </h1>
            <p className="text-[#6B6B6B] font-medium">Join drssed today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-[#2D2D2D] mb-2 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[#2D2D2D] mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-[#2D2D2D] mb-2 font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="phone"
                  type="tel"
                  placeholder="+233 XX XXX XXXX"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-[#2D2D2D] mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="mt-2">
              <label className="block text-[#2D2D2D] mb-3 font-medium">I am a:</label>
              <div className="bg-[#E76F51]/10 border border-[#E76F51]/30 rounded-lg p-3">
                <p className="text-sm text-center text-[#6B6B6B]">
                  Signing up as <span className="text-[#E76F51] font-semibold">Customer</span>
                </p>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-3 text-center font-medium">
                Designer? <Link to="/designer-signup" className="text-[#2D2D2D] font-bold hover:underline">Register here</Link>
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-[#E76F51] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold mt-4"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <span className="text-[#6B6B6B] font-medium">Already have an account? </span>
            <Link to="/login" className="text-[#E76F51] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
