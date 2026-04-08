import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Briefcase, MapPin, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { signupDesigner } from "../services/signupApi";

const SPECIALTY_OPTIONS = [
  "Wedding Dress",
  "Casual Wear",
  "Formal Wear",
  "Evening Gown",
  "Saree",
  "Kurti",
  "Lehenga",
  "Suits",
  "Bridal",
  "Kids Fashion",
  "Menswear",
  "Tailoring"
];

export default function DesignerSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specialties: [],
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSpecialty = (specialty) => {
    setFormData((prev) => {
      const specialties = prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties };
    });
  };

  const handleDesignerSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.businessName || !formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.specialties.length === 0) {
      setError("Please select at least one specialty.");
      return;
    }

    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    setLoading(true);

    try {
      const response = await signupDesigner({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        businessName: formData.businessName,
        phone: formData.phone,
        location: formData.location,
        specialties: formData.specialties,
      });
      console.log("Designer signup backend response:", response);

      navigate("/designer/dashboard", { replace: true });
    } catch (err) {
      console.error("Designer signup failed:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto pb-4">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 py-6 px-6 relative flex items-center justify-center">
          <Link to="/landing" className="absolute left-6 p-2 hover:bg-white/10 rounded-xl transition-all">
            <ArrowLeft size={24} className="text-white" />
          </Link>
          <img src={logo} alt="Drssed Logo" className="w-[60px] h-[60px] object-cover rounded-full shadow-lg" />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 w-full overflow-y-auto">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-[#F5E6D3] mb-2 text-3xl font-bold tracking-tight">
              Join as a Designer
            </h1>
            <p className="text-[#F5E6D3]/80 font-medium text-sm">
              Start your journey to reach more customers
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <form onSubmit={handleDesignerSignup} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Business Name
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="businessName"
                    type="text"
                    placeholder="Your fashion business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Business Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Business Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="location"
                    type="text"
                    placeholder="City, Region"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-[#2D2D2D] mb-3 text-sm font-semibold">
                  Specialties (Select at least one)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALTY_OPTIONS.map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => toggleSpecialty(specialty)}
                      disabled={loading}
                      className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        formData.specialties.includes(specialty)
                          ? "bg-[#E76F51] text-white border border-[#E76F51]"
                          : "bg-[#FAFAF8] text-[#2D2D2D] border border-[#E76F51]/20 hover:border-[#E76F51]/50"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {formData.specialties.includes(specialty) && <Check size={16} />}
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-[#2D2D2D] focus:ring-[#2D2D2D] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#6B6B6B] font-medium leading-relaxed">
                  I agree to the <span className="text-[#2D2D2D] font-bold">Terms of Service</span> and{" "}
                  <span className="text-[#2D2D2D] font-bold">Privacy Policy</span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-lg hover:bg-[#1D1D1D] hover:shadow-lg transition-all mt-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Designer Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E76F51]/10"></div>
              <span className="text-[#6B6B6B] text-sm font-medium">Already registered?</span>
              <div className="flex-1 h-px bg-[#E76F51]/10"></div>
            </div>

            {/* Login Link */}
            <Link
              to="/designer/login"
              className="block w-full text-center py-3 bg-[#E76F51]/10 hover:bg-[#E76F51]/20 text-[#2D2D2D] rounded-lg transition-all font-semibold"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

