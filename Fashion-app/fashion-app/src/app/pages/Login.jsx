import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import logo from "../../assets/drssed.jpg";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
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

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[#2D2D2D] mb-2 font-medium">
                Email or Phone
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                <input
                  id="email"
                  type="text"
                  placeholder="Enter email or phone"
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
                  placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E76F51]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
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
              className="w-full bg-[#E76F51] text-white py-3.5 rounded-lg hover:bg-[#D55B3A] transition-colors shadow-sm font-semibold text-[16px] mt-4"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <span className="text-[#6B6B6B] font-medium">Don't have an account? </span>
            <Link to="/signup" className="text-[#E76F51] font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
