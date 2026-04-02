import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
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
      navigate("/landing");
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
          <h2 className="text-3xl font-bold text-textPrimary mb-2">Welcome Back</h2>
          <h3 className="font-semibold text-textSecondary">Login to your account</h3>
        </div>

        <form onSubmit={handleEmailLogin} className="flex flex-col w-full">
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-4 pl-10"
            />
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-3 rounded-2xl font-semibold mb-4"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">or login with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleProviderLogin(GoogleAuthProvider)}
              className="flex-1 flex items-center justify-center gap-2 border rounded-2xl p-2 shadow hover:bg-gray-100"
            >
              <FcGoogle size={28} /> Google
            </button>
            <button
              type="button"
              onClick={() => handleProviderLogin(FacebookAuthProvider)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white border rounded-2xl p-2 shadow hover:opacity-90"
            >
              <FaFacebook size={28} /> Facebook
            </button>
          </div>

          <p className="text-center mt-6 text-textSecondary">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}