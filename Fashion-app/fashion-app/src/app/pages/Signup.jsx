import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

const ROLE_OPTIONS = ["Customer", "Designer"];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    if (!role) {
      setError("Please select your role.");
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
      navigate("/landing");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleProviderSignup = async (Provider) => {
    if (!phone.trim() || !role) {
      setError("Phone and role are required for social signup.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const provider = new Provider();
      const result = await signInWithPopup(auth, provider);
      await saveUserProfile(result.user, { name: result.user.displayName, email: result.user.email });
      navigate("/landing");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col">
        <div className="flex flex-col items-center w-full mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-logoSpinFade">
            <span className="text-3xl">🐝</span>
          </div>
        </div>

        <hr className="w-full border-gray-200 mb-6" />

        <div className="w-full text-left mb-6">
          <h2 className="text-3xl font-bold text-textPrimary mb-2">Create Account</h2>
          <h3 className="font-semibold text-textSecondary">Join DRSSED today</h3>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col w-full">
          {/* Name */}
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border rounded-lg p-4 pl-10"
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded-lg p-4 pl-10"
            />
          </div>

          {/* Phone */}
          <div className="relative mb-4">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 xx xxx xxxx"
              className="w-full border rounded-lg p-4 pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded-lg p-4 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border rounded-lg p-4 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Role */}
          <div className="mb-4">
            <p className="mb-2 font-medium">I am a:</p>
            <div className="flex gap-3">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRole(opt)}
                  className={`flex-1 rounded-2xl py-3 font-semibold transition-all ${
                    role === opt ? "bg-yellow-500 text-white shadow-sm" : "bg-white border border-gray-300 text-black"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-3 rounded-2xl font-semibold mb-4"
          >
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Social login */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">or sign up with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleProviderSignup(GoogleAuthProvider)}
              className="flex-1 flex items-center justify-center gap-2 border rounded-2xl p-2 shadow hover:bg-gray-100"
            >
              <FcGoogle size={28} /> Google
            </button>
            <button
              type="button"
              onClick={() => handleProviderSignup(FacebookAuthProvider)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white border rounded-2xl p-2 shadow hover:opacity-90"
            >
              <FaFacebook size={28} /> Facebook
            </button>
          </div>

          <p className="text-center mt-6 text-textSecondary">
            Already have an account? <Link to="/login" className="text-teal font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}