<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, authPersistenceReady, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import DrssedLogo from "../components/DressedLogo";
import SocialButtons from "../components/SocialButtons";
import { signInWithPopupOrRedirect } from "../utils/socialAuth";
import { syncUserToFirestore } from "../utils/firestoreSync";
import { redirectByRole } from "../utils/authRedirect";

export default function DesignerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const handleRedirect = async () => {
      try {
        await authPersistenceReady;
        const result = await getRedirectResult(auth);
        if (!result?.user || cancelled) return;

        const provider = result.providerId?.includes("facebook") ? "facebook" : "google";
        await syncUserToFirestore(result.user, provider, { role: "Designer" });
        sessionStorage.removeItem("designerLoginSocialRedirect");
        
        // Use role-aware redirect
        await redirectByRole(result.user, navigate, {
          defaultRole: "Designer",
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
    setError("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const outcome = await signInWithPopupOrRedirect(auth, provider, {
        redirectStateKey: "designerLoginSocialRedirect",
      });
      if (outcome.mode === "popup") {
        await syncUserToFirestore(outcome.result.user, "google", { role: "Designer" });
        // Use role-aware redirect
        await redirectByRole(outcome.result.user, navigate, {
          defaultRole: "Designer",
          onLoading: setIsRedirecting,
        });
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setError(error.message?.replace("Firebase: ", "") || "Google authentication failed");
    }
  };

  const handleFacebookAuth = async () => {
    setError("");
    const provider = new FacebookAuthProvider();
    try {
      const outcome = await signInWithPopupOrRedirect(auth, provider, {
        redirectStateKey: "designerLoginSocialRedirect",
      });
      if (outcome.mode === "popup") {
        await syncUserToFirestore(outcome.result.user, "facebook", { role: "Designer" });
        // Use role-aware redirect
        await redirectByRole(outcome.result.user, navigate, {
          defaultRole: "Designer",
          onLoading: setIsRedirecting,
        });
      }
    } catch (error) {
      console.error("Facebook auth error:", error);
      setError(error.message?.replace("Firebase: ", "") || "Facebook authentication failed");
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

            {isRedirecting && (
              <div className="flex gap-2 items-center justify-center bg-[#E76F51]/20 border border-[#E76F51]/50 rounded-lg p-3">
                <div className="w-4 h-4 border-2 border-[#E76F51] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#E76F51] text-sm font-['Raleway']">Completing sign in...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || isRedirecting}
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
          </form>

          <div className="mt-6 social-auth">
            <SocialButtons
              variant="dark"
              onGoogle={handleGoogleAuth}
              onFacebook={handleFacebookAuth}
            />
          </div>

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
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { authenticateDesigner } from "../data/mockData";

export default function DesignerLogin() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!email || !password) {
			setError("Email and password are required.");
			return;
		}

		setSubmitting(true);
		const result = authenticateDesigner(email, password);
		if (!result.ok) {
			setError(result.error);
			setSubmitting(false);
			return;
		}
		navigate("/designer-home");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F8EFE7] px-4 py-8 flex items-center justify-center">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center">
						<LogIn className="w-5 h-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-[#2D2D2D]">Designer Login</h1>
						<p className="text-sm text-gray-600">Access portfolio, projects, and earnings.</p>
					</div>
				</div>

				<div className="rounded-xl border border-[#E76F51]/30 bg-[#FFF6F1] p-3 text-sm text-[#7A3E2E] mb-5">
					Demo login: <span className="font-semibold">ama@drssed.com</span> / <span className="font-semibold">designer123</span>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block">
						<span className="text-sm font-medium text-[#2D2D2D]">Email</span>
						<div className="relative mt-1">
							<Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
							<input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								className="w-full border rounded-xl p-3 pl-10"
								placeholder="designer@drssed.com"
							/>
						</div>
					</label>

					<label className="block">
						<span className="text-sm font-medium text-[#2D2D2D]">Password</span>
						<div className="relative mt-1">
							<Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								className="w-full border rounded-xl p-3 pl-10"
							/>
						</div>
					</label>

					{error ? <p className="text-sm text-red-600">{error}</p> : null}

					<button
						type="submit"
						disabled={submitting}
						className="w-full bg-[#2D2D2D] hover:bg-black text-white rounded-xl py-3 font-semibold"
					>
						{submitting ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<p className="text-sm text-center text-gray-700 mt-5">
					New designer?{" "}
					<Link to="/designer-signup" className="text-[#E76F51] font-semibold">
						Create account
					</Link>
				</p>
			</div>
		</div>
	);
>>>>>>> Stashed changes
}
