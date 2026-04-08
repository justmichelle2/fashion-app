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
        if (result.user?.userType !== "customer") {
          await handleLogout();
          setError("This login is for customers only. Please use the designer login page.");
          return;
        }
        console.log("Customer login successful");
        navigate("/customer/home", { replace: true });
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await handleGoogleSignIn();
      
      if (result.success) {
        if (result.user?.userType !== "customer") {
          await handleLogout();
          setError("This login is for customers only. Please use the designer login page.");
          return;
        }
        console.log("Customer Google login successful");
        navigate("/customer/home", { replace: true });
      } else {
        setError(result.error || "Google sign-in failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during Google sign-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[90vh] sm:h-auto pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[#E76F51]/10 py-6 px-6 relative flex justify-center items-center">
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent disabled:opacity-50"
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button type="button" className="text-[#E76F51] text-sm font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E76F51] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold text-[16px] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Sign in with Google"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <span className="text-[#6B6B6B] font-medium">Don't have an account? </span>
            <Link to="/customer/signup" className="text-[#E76F51] font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
