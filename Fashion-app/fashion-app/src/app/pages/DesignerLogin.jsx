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
          New designer? {" "}
          <Link to="/designer-signup" className="text-[#E76F51] font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
