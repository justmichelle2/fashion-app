import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import DrssedLogo from "../components/DressedLogo";
import SocialButtons from "../components/SocialButtons";

export default function DesignerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const role = "Designer";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!phone.trim()) {
      setError("Phone number is required.");
      return false;
    }
    return true;
  };

  const saveUserProfile = async (user, overrides = {}) => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: overrides.name || form.name,
        email: overrides.email || form.email || user.email || "",
        phone,
        role,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setSubmitting(true);
      setError("");
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await saveUserProfile(credential.user);
      navigate("/designer-dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleProviderSignup = async (Provider) => {
    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const provider = new Provider();
      const result = await signInWithPopup(auth, provider);
      await saveUserProfile(result.user, { name: result.user.displayName, email: result.user.email });
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

      <div className="relative z-10 w-full max-w-sm max-h-[92vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <DrssedLogo size={84} className="drop-shadow-2xl mb-4" />
          <h1 className="text-[#F5E6D3] mb-2 text-4xl font-bold font-['Playfair_Display'] tracking-wide">drssed</h1>
          <p className="text-[#F5E6D3]/80 text-sm font-['Raleway'] tracking-[0.08em]">Designer Signup</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-xl p-4 pl-12 border border-white/20 focus:border-[#E76F51] focus:outline-none transition backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-xl p-4 pl-12 border border-white/20 focus:border-[#E76F51] focus:outline-none transition backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 xx xxx xxxx"
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-xl p-4 pl-12 border border-white/20 focus:border-[#E76F51] focus:outline-none transition backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
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

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-white/60" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-white/10 text-white placeholder-white/60 rounded-xl p-4 pl-12 pr-12 border border-white/20 focus:border-[#E76F51] focus:outline-none transition backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-white/60 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              {submitting ? "Creating Account..." : "Create Designer Account"}
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
              onGoogle={() => handleProviderSignup(GoogleAuthProvider)}
              onFacebook={() => handleProviderSignup(FacebookAuthProvider)}
            />
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-white/80 font-['Raleway']">
              Already have an account?{" "}
              <Link to="/login/designer" className="text-[#F4A261] hover:text-[#E76F51] font-semibold transition">
                Sign in
              </Link>
            </p>
            <p className="text-white/60 font-['Raleway'] text-sm">
              Customer?{" "}
              <Link to="/signup/customer" className="text-[#F4A261] hover:text-[#E76F51] font-semibold transition">
                Create customer account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
