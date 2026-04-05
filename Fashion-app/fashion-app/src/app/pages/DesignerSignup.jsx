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
                  placeholder="Bridal and Occasionwear"
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
            Already have an account? {" "}
            <Link to="/designer-login" className="text-[#E76F51] font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
