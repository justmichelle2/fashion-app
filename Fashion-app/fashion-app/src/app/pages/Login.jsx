import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { handleLogin, handleGoogleSignIn, handleLogout } from "../utils/authUtils";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await handleLogin(email, password);
      
      if (result.success) {
        console.log("Login result:", result.user);
        
        if (result.user?.userType && result.user.userType !== "customer") {
          await handleLogout();
          setError("This login is for customers only. Please use the designer login page.");
          setLoading(false);
          return;
        }
        
        console.log("Customer login successful, redirecting...");
        navigate("/customer/home", { replace: true });
      } else {
        setError(result.error || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError(err.message || "An unexpected error occurred during login");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await handleGoogleSignIn();
      
      if (result.success) {
        console.log("Google login result:", result.user);
        
        if (result.user?.userType && result.user.userType !== "customer") {
          await handleLogout();
          setError("This login is for customers only. Please use the designer login page.");
          setLoading(false);
          return;
        }
        
        console.log("Customer Google login successful, redirecting...");
        navigate("/customer/home", { replace: true });
      } else {
        setError(result.error || "Google sign-in failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Google login exception:", err);
      setError(err.message || "An unexpected error occurred during Google sign-in");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[90vh] sm:h-auto pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[#E63946]/10 py-6 px-6 relative flex justify-center items-center">
          <Link to="/landing" className="absolute left-6 p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </Link>
          <img src={logo} alt="Drssed Logo" className="w-[60px] h-[60px] object-cover rounded-full shadow-sm" />
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pt-8 pb-4 w-full overflow-y-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-[#2D2D2D] mb-2 text-3xl font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#6B6B6B] font-medium">Sign in to continue to drssed</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent disabled:opacity-50"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button type="button" className="text-[#E63946] text-sm font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E63946] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold text-[16px] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#DADCE0] text-[#3C4043] py-3 rounded-xl shadow-[0_1px_2px_rgba(60,64,67,0.15)] hover:shadow-[0_2px_6px_rgba(60,64,67,0.3)] transition-shadow font-medium text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"/>
                <path fill="#4285F4" d="M21.1 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.4-1.1 2.6-2.3 3.4l3 2.3c1.8-1.7 3-4.3 3-8z"/>
                <path fill="#FBBC05" d="M6.1 14.3c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8l-3-2.3C2.6 9.5 2.3 10.7 2.3 12s.3 2.5.8 3.6l3-2.3z"/>
                <path fill="#34A853" d="M12 21.5c2.6 0 4.8-.9 6.4-2.3l-3-2.3c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1l-3 2.3c1.6 3.1 4.8 5.4 8.6 5.4z"/>
              </svg>
              <span>{loading ? "Loading..." : "Continue with Google"}</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <span className="text-[#6B6B6B] font-medium">Don't have an account? </span>
            <Link to="/customer/signup" className="text-[#E63946] font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
