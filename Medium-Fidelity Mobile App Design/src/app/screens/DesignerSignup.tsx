import { Link, useNavigate } from "react-router";
import { DrssedLogo } from "../components/DrssedLogo";
import { Mail, Lock, User, Phone, Briefcase, MapPin, ArrowLeft } from "lucide-react";

export function DesignerSignup() {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - navigate to designer dashboard
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
      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-[#F5E6D3] mb-2" style={{ fontSize: "32px", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
            Join as a Designer
          </h1>
          <p className="text-[#F5E6D3]/80" style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}>
            Start your journey to reach more customers
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Business Name
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="businessName"
                  type="text"
                  placeholder="Your fashion business name"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Business Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="phone"
                  type="tel"
                  placeholder="+233 XX XXX XXXX"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Business Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="location"
                  type="text"
                  placeholder="City, Region"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[#2D2D2D] mb-2" style={{ fontSize: "14px", fontWeight: "600", fontFamily: "var(--font-body)" }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 rounded border-gray-300 text-[#2D2D2D] focus:ring-[#2D2D2D]"
              />
              <label htmlFor="terms" className="text-sm text-[#6B6B6B]" style={{ fontFamily: "var(--font-body)" }}>
                I agree to the <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>Terms of Service</span> and{" "}
                <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>Privacy Policy</span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-lg hover:bg-[#1D1D1D] hover:shadow-lg transition-all mt-2"
              style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
            >
              Create Designer Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E76F51]/10"></div>
            <span className="text-[#6B6B6B] text-sm" style={{ fontFamily: "var(--font-body)" }}>Already registered?</span>
            <div className="flex-1 h-px bg-[#E76F51]/10"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/designer-login"
            className="block w-full text-center py-3 bg-[#E76F51]/10 hover:bg-[#E76F51]/20 text-[#2D2D2D] rounded-lg transition-all"
            style={{ fontWeight: "600", fontFamily: "var(--font-body)" }}
          >
            Sign In Instead
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center mb-6">
          <Link to="/landing" className="text-[#F5E6D3]/80 hover:text-[#F5E6D3] text-sm" style={{ fontFamily: "var(--font-body)" }}>
            ← Back to main page
          </Link>
        </div>
      </div>
    </div>
  );
}