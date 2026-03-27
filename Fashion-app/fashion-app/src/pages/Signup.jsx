import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

const ROLE_OPTIONS = ["Customer", "Designer"];

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfileFields = () => {
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

  const validateEmailSignup = () => {
    if (!form.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!form.password.trim()) {
      setError("Password is required.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return validateProfileFields();
  };

  const saveUserProfile = async (user, overrides = {}) => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: overrides.name ?? form.name,
        email: overrides.email ?? form.email ?? user.email ?? "",
        phone,
        role,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!validateEmailSignup()) {
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      await saveUserProfile(credential.user);
    } catch (signupError) {
      setError(signupError.message.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleProviderSignup = async (Provider) => {
    if (!validateProfileFields()) {
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const provider = new Provider();
      const result = await signInWithPopup(auth, provider);
      await saveUserProfile(result.user, {
        name: result.user.displayName ?? form.name,
        email: result.user.email ?? form.email,
      });
    } catch (providerError) {
      setError(providerError.message.replace("Firebase: ", ""));
      console.error(providerError);
    } finally {
      setSubmitting(false);
    }
  };

  const signupWithGoogle = () => handleProviderSignup(GoogleAuthProvider);

  const signupWithFacebook = () => handleProviderSignup(FacebookAuthProvider);

  return (
    <div className="min-h-[85vh] bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col">
        <div className="flex flex-col items-center w-full mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-logoSpinFade">
            <span className="text-3xl">🐝</span>
          </div>
        </div>

        <hr className="w-full border-gray-200 mb-6" />

        <div className="w-full text-left">
          <h2 className="text-3xl font-bold text-textPrimary mb-2">Create Account</h2>
          <h3 className="font-semibold text-textSecondary mb-8">
            Join DRSSED today
          </h3>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col w-full">
          <label className="font-medium text-textSecondary mb-2" htmlFor="fullName">
            Full Name
          </label>
          <div className="relative mb-6">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              id="fullName"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border rounded-lg p-4 pl-10"
            />
          </div>

          <label className="font-medium text-textSecondary mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative mb-6">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-4 pl-10"
              required
            />
          </div>

          <label className="font-medium text-textSecondary mb-2" htmlFor="phone">
            Phone Number
          </label>
          <div className="relative mb-6">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              id="phone"
              type="tel"
              placeholder="+233 xx xxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 pl-10 border rounded-lg"
              required
            />
          </div>

          <label htmlFor="password" className="font-medium text-textSecondary mb-2">
            Password
          </label>
          <div className="relative mb-6">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded-lg p-4 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label htmlFor="confirmPassword" className="font-medium text-textSecondary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full border rounded-lg p-4 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="w-full mt-6">
            <p className="font-medium text-base mb-3">I am a:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {ROLE_OPTIONS.map((option) => {
                const isActive = role === option;
                const baseStyle =
                  "flex-1 rounded-2xl border-2 px-4 py-3 font-semibold scale-[.98] active:duration-75 hover:scale-[1.01] transition-all ease-in-out";
                const designerStyle = isActive
                  ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                  : "bg-white border-gray-400 text-black hover:border-yellow-500";
                const customerStyle = isActive
                  ? "bg-yellow-600 border-yellow-600 text-white shadow-sm"
                  : "bg-yellow-500 border-yellow-500 text-white hover:border-yellow-600";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    aria-pressed={isActive}
                    className={`${baseStyle} ${
                      option === "Customer" ? customerStyle : designerStyle
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="p-4 mb-1 flex items-center" htmlFor="remember">
            <input id="remember" type="checkbox" className="mr-2" />
            <span className="font-medium text-base">Remember Me</span>
          </label>

          <div className="flex flex-wrap gap-4 mt-4 w-full">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all bg-primary text-black px-4 py-3 rounded-2xl font-semibold disabled:opacity-70"
            >
              {submitting ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          <div className="flex items-center gap-4 my-6 w-full">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              or sign up with
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="flex flex-wrap gap-4 mt-4 w-full">
            <button
              type="button"
              onClick={signupWithGoogle}
              className="flex-1 scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all flex items-center justify-center gap-1 bg-white border px-4 py-2 rounded-2xl shadow hover:bg-gray-100 font-semibold"
            >
              <FcGoogle size={32} />
              Google
            </button>
            <button
              type="button"
              onClick={signupWithFacebook}
              className="flex-1 scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all flex items-center justify-center gap-2 bg-[#1877F2] text-white border px-4 py-2 rounded-2xl shadow hover:opacity-90 font-semibold"
            >
              <FaFacebook size={32} />
              Facebook
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

        <p className="text-center mt-6 text-textSecondary">
          Already have an account?{" "}
          <Link to="/login" className="text-teal font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}