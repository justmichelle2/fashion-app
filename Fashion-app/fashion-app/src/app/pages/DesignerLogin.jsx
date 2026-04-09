import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Briefcase, TrendingUp, Users, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { handleLogin, handleLogout } from "../utils/authUtils";

export default function DesignerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDesignerLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await handleLogin(email, password);
      if (result.success) {
        if (result.user?.userType !== "designer") {
          await handleLogout();
          setError("This login is for designers only. Please use customer login.");
          return;
        }
        navigate("/designer/dashboard", { replace: true });
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
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
              Designer Portal
            </h1>
            <p className="text-[#F5E6D3]/80 font-medium">
              Manage your business and grow your clientele
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 flex flex-col items-center sm:items-start text-center sm:text-left">
              <Briefcase className="w-5 h-5 text-[#D4AF37] mb-2" />
              <p className="text-[#F5E6D3] text-xs font-medium">Manage Orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 flex flex-col items-center sm:items-start text-center sm:text-left">
              <TrendingUp className="w-5 h-5 text-[#D4AF37] mb-2" />
              <p className="text-[#F5E6D3] text-xs font-medium">Track Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 flex flex-col items-center sm:items-start text-center sm:text-left">
              <Users className="w-5 h-5 text-[#D4AF37] mb-2" />
              <p className="text-[#F5E6D3] text-xs font-medium">Client Management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 flex flex-col items-center sm:items-start text-center sm:text-left">
              <CheckCircle className="w-5 h-5 text-[#D4AF37] mb-2" />
              <p className="text-[#F5E6D3] text-xs font-medium">Portfolio Builder</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <form onSubmit={handleDesignerLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}
              {/* Business Email Input */}
              <div>
                <label htmlFor="email" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Business Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="designer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-[#2D2D2D] mb-2 text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFAF8] border border-[#E63946]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#2D2D2D] focus:ring-[#2D2D2D] cursor-pointer"
                  />
                  <span className="text-sm text-[#6B6B6B] font-medium">Remember me</span>
                </label>
                <button type="button" className="text-[#E63946] text-sm font-bold hover:underline">
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-lg hover:bg-[#1D1D1D] hover:shadow-lg transition-all font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Access Dashboard"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E63946]/10"></div>
              <span className="text-[#6B6B6B] text-sm font-medium">New Designer?</span>
              <div className="flex-1 h-px bg-[#E63946]/10"></div>
            </div>

            {/* Register Link */}
            <Link 
              to="/designer/signup"
              className="block w-full text-center py-3.5 bg-[#E63946] hover:bg-[#C92A2A] text-white rounded-lg transition-all shadow-sm font-semibold"
            >
              Register Your Business
            </Link>
          </div>

          {/* Footer Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-[#F5E6D3] text-center text-sm mb-1 font-bold">
              Join Ghana's Premier Fashion Network
            </p>
            <p className="text-[#F5E6D3]/80 text-center text-xs font-medium">
              Connect with thousands of customers looking for bespoke designs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

