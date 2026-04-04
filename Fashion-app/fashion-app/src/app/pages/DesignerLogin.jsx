import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import DrssedLogo from "../components/DressedLogo";
import SocialButtons from "../components/SocialButtons";

export default function DesignerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/designer-dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleProviderLogin = async (Provider) => {
    try {
      setSubmitting(true);
      setError("");
      const provider = new Provider();
      await signInWithPopup(auth, provider);
      navigate("/designer-dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-3xl opacity-20" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <DrssedLogo size={84} className="drop-shadow-2xl mb-4" />
          <h1 className="text-[#F5E6D3] mb-2 text-4xl font-bold font-['Playfair_Display'] tracking-wide">drssed</h1>
          <p className="text-[#F5E6D3]/80 text-sm font-['Raleway'] tracking-[0.08em]">Designer Login</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-xl p-4 pl-12 border border-white/20 focus:border-[#E76F51] focus:outline-none transition backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-xl p-4 pl-12 pr-12 border border-white/20 focus:border-[#E76F51] focus:outline-none transition backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-white/60 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex gap-2 items-start bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing In..." : "Access Dashboard"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#3D3D3D] text-white/60 font-['Raleway']">or continue with</span>
              </div>
            </div>

            <SocialButtons
              variant="dark"
              onGoogle={() => handleProviderLogin(GoogleAuthProvider)}
              onFacebook={() => handleProviderLogin(FacebookAuthProvider)}
            />
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-white/80 font-['Raleway']">
              Need a designer account?{" "}
              <Link to="/signup/designer" className="text-[#F4A261] hover:text-[#E76F51] font-semibold transition">
                Sign up
              </Link>
            </p>
            <p className="text-white/60 font-['Raleway'] text-sm">
              Customer?{" "}
              <Link to="/login/customer" className="text-[#F4A261] hover:text-[#E76F51] font-semibold transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
