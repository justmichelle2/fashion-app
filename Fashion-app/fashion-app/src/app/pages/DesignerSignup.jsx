<<<<<<< Updated upstream
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

export default function DesignerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const role = "Designer";
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
        await syncUserToFirestore(result.user, provider, { role, phone: "" });
        sessionStorage.removeItem("designerSignupSocialRedirect");
        
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
    setAuthMethod("oauth");
    setError("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const outcome = await signInWithPopupOrRedirect(auth, provider, {
        redirectStateKey: "designerSignupSocialRedirect",
      });
      if (outcome.mode === "popup") {
        await syncUserToFirestore(outcome.result.user, "google", { role, phone: "" });
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
    setAuthMethod("oauth");
    setError("");
    const provider = new FacebookAuthProvider();
    try {
      const outcome = await signInWithPopupOrRedirect(auth, provider, {
        redirectStateKey: "designerSignupSocialRedirect",
      });
      if (outcome.mode === "popup") {
        await syncUserToFirestore(outcome.result.user, "facebook", { role, phone: "" });
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

            {isRedirecting && (
              <div className="flex gap-2 items-center justify-center bg-[#E76F51]/20 border border-[#E76F51]/50 rounded-lg p-3">
                <div className="w-4 h-4 border-2 border-[#E76F51] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#E76F51] text-sm font-['Raleway']">Completing sign up...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || isRedirecting}
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
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, MapPin, Scissors, Mail, Lock, User } from "lucide-react";
import { createDesignerAccount } from "../data/mockData";

export default function DesignerSignup() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		specialty: "",
		location: "",
		bio: "",
	});
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const onChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!form.name || !form.email || !form.password || !form.specialty || !form.location) {
			setError("Please complete all required fields.");
			return;
		}
		if (form.password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setSubmitting(true);
		const result = createDesignerAccount(form);
		if (!result.ok) {
			setError(result.error);
			setSubmitting(false);
			return;
		}
		navigate("/designer-home");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F8EFE7] px-4 py-8 flex items-center justify-center">
			<div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center">
						<UserPlus className="w-5 h-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-[#2D2D2D]">Designer Signup</h1>
						<p className="text-sm text-gray-600">Create your portfolio and manage your tailoring projects.</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block">
						<span className="text-sm font-medium text-[#2D2D2D]">Full Name</span>
						<div className="relative mt-1">
							<User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
							<input
								name="name"
								value={form.name}
								onChange={onChange}
								className="w-full border rounded-xl p-3 pl-10"
								placeholder="Ama Mensah"
							/>
						</div>
					</label>

					<label className="block">
						<span className="text-sm font-medium text-[#2D2D2D]">Email</span>
						<div className="relative mt-1">
							<Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={onChange}
								className="w-full border rounded-xl p-3 pl-10"
								placeholder="designer@drssed.com"
							/>
						</div>
					</label>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-[#2D2D2D]">Password</span>
							<div className="relative mt-1">
								<Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
								<input
									type="password"
									name="password"
									value={form.password}
									onChange={onChange}
									className="w-full border rounded-xl p-3 pl-10"
								/>
							</div>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-[#2D2D2D]">Confirm Password</span>
							<div className="relative mt-1">
								<Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
								<input
									type="password"
									name="confirmPassword"
									value={form.confirmPassword}
									onChange={onChange}
									className="w-full border rounded-xl p-3 pl-10"
								/>
							</div>
						</label>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="block">
							<span className="text-sm font-medium text-[#2D2D2D]">Specialty</span>
							<div className="relative mt-1">
								<Scissors className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
								<input
									name="specialty"
									value={form.specialty}
									onChange={onChange}
									className="w-full border rounded-xl p-3 pl-10"
									placeholder="Bridal & Occasionwear"
								/>
							</div>
						</label>

						<label className="block">
							<span className="text-sm font-medium text-[#2D2D2D]">Location</span>
							<div className="relative mt-1">
								<MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
								<input
									name="location"
									value={form.location}
									onChange={onChange}
									className="w-full border rounded-xl p-3 pl-10"
									placeholder="Accra"
								/>
							</div>
						</label>
					</div>

					<label className="block">
						<span className="text-sm font-medium text-[#2D2D2D]">Bio</span>
						<textarea
							name="bio"
							rows={3}
							value={form.bio}
							onChange={onChange}
							className="w-full border rounded-xl p-3 mt-1"
							placeholder="Tell customers about your style and experience."
						/>
					</label>

					{error ? <p className="text-sm text-red-600">{error}</p> : null}

					<button
						type="submit"
						disabled={submitting}
						className="w-full bg-[#E76F51] hover:bg-[#D55B3A] text-white rounded-xl py-3 font-semibold"
					>
						{submitting ? "Creating account..." : "Create Designer Account"}
					</button>

					<p className="text-sm text-center text-gray-700">
						Already have an account?{" "}
						<Link to="/designer-login" className="text-[#E76F51] font-semibold">
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
>>>>>>> Stashed changes
}
