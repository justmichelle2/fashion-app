import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowLeft, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { handleValidatePassword, loadPasswordPolicy } from "../utils/authUtils";
import { signupCustomer } from "../services/signupApi";

export default function Signup() {
  const navigate = useNavigate();
  const validationRequestIdRef = useRef(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordPolicyNotice, setPasswordPolicyNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Load Firebase password policy once to avoid repeated network calls during typing.
    loadPasswordPolicy().then((result) => {
      if (!isMounted) {
        return;
      }

      if (result?.source === "fallback" && result?.message) {
        setPasswordPolicyNotice(result.message);
      } else {
        setPasswordPolicyNotice("");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    const password = e.target.value;
    const requestId = ++validationRequestIdRef.current;
    setFormData(prev => ({
      ...prev,
      password
    }));

    if (password) {
      const validation = await handleValidatePassword(password);
      if (requestId === validationRequestIdRef.current) {
        setPasswordErrors(validation.issues);
      }
    } else {
      validationRequestIdRef.current += 1;
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check password validation
    if (passwordErrors.length > 0) {
      setError("Please fix password requirements.");
      return;
    }

    setLoading(true);

    try {
      const response = await signupCustomer({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      });
      console.log("Customer signup backend response:", response);

      navigate("/customer/home", { replace: true });
    } catch (err) {
      console.error("Customer signup failed:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[90vh] sm:h-auto pb-6">
        {/* Header */}
        <div className="bg-white border-b border-[#E63946]/10 py-6 px-6 relative flex items-center justify-center">
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="text-red-700 flex-shrink-0" size={18} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Password policy fallback notice */}
          {passwordPolicyNotice && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
              <AlertCircle className="text-amber-700 flex-shrink-0" size={18} />
              <p className="text-amber-700 text-sm font-medium">{passwordPolicyNotice}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-[#2D2D2D] mb-2 font-medium">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[#2D2D2D] mb-2 font-medium">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-[#2D2D2D] mb-2 font-medium">
                Phone Number (Optional)
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-[#2D2D2D] mb-2 font-medium">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent disabled:opacity-50"
                />
              </div>
              
              {/* Password Requirements */}
              {formData.password && passwordErrors.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium mb-2">Password requirements:</p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {passwordErrors.map((issue, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div className="mt-4">
              <label className="block text-[#2D2D2D] mb-3 font-medium">Account Type:</label>
              <div className="bg-[#E63946]/10 border border-[#E63946]/30 rounded-lg p-3">
                <p className="text-sm text-center text-[#6B6B6B]">
                  Creating account as <span className="text-[#E63946] font-semibold">Customer</span>
                </p>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-3 text-center font-medium">
                Designer? <Link to="/designer/signup" className="text-[#E63946] font-bold hover:underline">Register as designer</Link>
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="w-full bg-[#E63946] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <span className="text-[#6B6B6B] font-medium">Already have an account? </span>
            <Link to="/customer/login" className="text-[#E63946] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
