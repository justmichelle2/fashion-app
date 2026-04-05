import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, authPersistenceReady, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import DrssedLogo from "../components/DressedLogo";
import SocialButtons from "../components/SocialButtons";
import { signInWithPopupOrRedirect } from "../utils/socialAuth";
import { syncUserToFirestore } from "../utils/firestoreSync";
import { redirectByRole } from "../utils/authRedirect";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const role = "Customer";
  const [authMethod, setAuthMethod] = useState("manual");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    if (authMethod !== "manual") {
      return true;
    }
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
    setAuthMethod("manual");
    if (!validateFields()) return;

    try {
      setSubmitting(true);
      setError("");
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await saveUserProfile(credential.user);
      navigate("/landing");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const handleRedirect = async () => {
      try {
        await authPersistenceReady;
        const result = await getRedirectResult(auth);
        if (!result?.user || cancelled) return;

        const provider = result.providerId?.includes("facebook") ? "facebook" : "google";
        await syncUserToFirestore(result.user, provider, { role, phone: "" });
        sessionStorage.removeItem("signupSocialRedirect");
        
        // Use role-aware redirect
        await redirectByRole(result.user, navigate, {
          defaultRole: "Customer",
          onLoading: (loading) => !cancelled && setIsRedirecting(loading),
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Redirect auth error:", error);
          setError(error.message?.replace("Firebase: ", "") || "Authentication failed");
        }
      }
    };

    handleRedirect();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleGoogleAuth = async () => {
    setAuthMethod("oauth");
    setError("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const outcome = await signInWithPopupOrRedirect(auth, provider, {
        redirectStateKey: "signupSocialRedirect",
      });
      if (outcome.mode === "popup") {
        await syncUserToFirestore(outcome.result.user, "google", { role, phone: "" });
        // Use role-aware redirect
        await redirectByRole(outcome.result.user, navigate, {
          defaultRole: "Customer",
          onLoading: setIsRedirecting,
        });
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setError(error.message?.replace("Firebase: ", "") || "Google authentication failed");
    }
  };

  const handleFacebookAuth = async () => {
    setAuthMethod("oauth");
    setError("");
    const provider = new FacebookAuthProvider();
    try {
      const outcome = await signInWithPopupOrRedirect(auth, provider, {
        redirectStateKey: "signupSocialRedirect",
      });
      if (outcome.mode === "popup") {
        await syncUserToFirestore(outcome.result.user, "facebook", { role, phone: "" });
        // Use role-aware redirect
        await redirectByRole(outcome.result.user, navigate, {
          defaultRole: "Customer",
          onLoading: setIsRedirecting,
        });
      }
    } catch (error) {
      console.error("Facebook auth error:", error);
      setError(error.message?.replace("Firebase: ", "") || "Facebook authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF8] to-[#F5E6D3]/20 flex flex-col items-center justify-center px-6 py-8 relative">
      <div className="relative z-10 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-10">
          <DrssedLogo size={84} className="drop-shadow-lg mb-4" />
          <h1 className="text-[#2D2D2D] mb-1 text-4xl font-bold font-['Playfair_Display'] tracking-wide">drssed</h1>
          <p className="text-[#6B6B6B] text-sm font-['Raleway'] tracking-[0.08em]">Create Your Account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E76F51]/10">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-[#E76F51]" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 pl-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none transition"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-[#E76F51]" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 pl-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none transition"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-4 w-5 h-5 text-[#E76F51]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 xx xxx xxxx"
                className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 pl-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-[#E76F51]" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 pl-12 pr-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-[#6B6B6B] hover:text-[#E76F51] transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-[#E76F51]" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 pl-12 pr-12 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-[#6B6B6B] hover:text-[#E76F51] transition"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex gap-2 items-start bg-red-500/15 border border-red-500/30 rounded-lg p-3 mt-4">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-['Raleway']">{error}</p>
              </div>
            )}

            {isRedirecting && (
              <div className="flex gap-2 items-center justify-center bg-[#E76F51]/20 border border-[#E76F51]/30 rounded-lg p-3 mt-4">
                <div className="w-4 h-4 border-2 border-[#E76F51] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#E76F51] text-sm font-['Raleway']">Completing sign up...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || isRedirecting}
              className="w-full h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E76F51]/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6B6B6B] font-['Raleway']">or continue with</span>
              </div>
            </div>

          </form>

          <div className="mt-6 social-auth">
            <SocialButtons
              variant="light"
              onGoogle={handleGoogleAuth}
              onFacebook={handleFacebookAuth}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#6B6B6B] font-['Raleway']">
              Already have an account?{" "}
              <Link to="/login/customer" className="text-[#E76F51] hover:text-[#D55B3A] font-semibold transition">
                Sign in
              </Link>
            </p>
            <p className="text-[#6B6B6B] font-['Raleway'] text-sm mt-2">
              Designer?{" "}
              <Link to="/signup/designer" className="text-[#E76F51] hover:text-[#D55B3A] font-semibold transition">
                Create designer account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}