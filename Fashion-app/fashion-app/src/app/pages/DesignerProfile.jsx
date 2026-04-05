import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Mail, MapPin, Sparkles, UserRound, Wallet } from "lucide-react";
import { formatCurrency, getCurrentDesigner, getEarningsSummary, updateDesigner } from "../data/mockData";

export default function DesignerProfile() {
  const [designer, setDesigner] = useState(() => getCurrentDesigner());
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(() => ({
    name: designer?.name || "",
    specialty: designer?.specialty || "",
    location: designer?.location || "",
    bio: designer?.bio || "",
  }));

  if (!designer) {
    return <Navigate to="/designer-login" replace />;
  }

  const earnings = getEarningsSummary(designer);

  const summary = useMemo(() => {
    const active = designer.projects.filter((project) => project.status === "in_progress").length;
    const completed = designer.projects.filter((project) => project.status === "completed").length;
    return {
      portfolio: designer.portfolio.length,
      measurements: designer.measurements.length,
      projects: designer.projects.length,
      active,
      completed,
    };
  }, [designer]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.specialty.trim() || !form.location.trim()) {
      setMessage("Name, specialty, and location are required.");
      return;
    }

    const next = updateDesigner(designer.id, (current) => ({
      ...current,
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
    }));

    setDesigner(next);
    setMessage("Profile updated successfully.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F8EFE7] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="bg-white rounded-3xl shadow-md p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#E76F51] font-semibold tracking-wide">DESIGNER PROFILE</p>
              <h1 className="text-3xl font-bold text-[#2D2D2D] mt-1">{designer.name}</h1>
              <p className="text-gray-600 mt-2 max-w-xl">Keep your profile updated so clients can trust your style and expertise.</p>
            </div>

            <div className="flex gap-3">
              <Link to="/designer-home" className="px-4 py-2 rounded-xl border border-[#2D2D2D] text-[#2D2D2D]">
                Designer Home
              </Link>
              <Link to="/designer-dashboard" className="px-4 py-2 rounded-xl bg-[#2D2D2D] text-white">
                Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-5">
            <div className="rounded-xl bg-[#FFF5EE] p-4">
              <p className="text-xs text-gray-600">Portfolio</p>
              <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{summary.portfolio}</p>
            </div>
            <div className="rounded-xl bg-[#EFF6FF] p-4">
              <p className="text-xs text-gray-600">Measurements</p>
              <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{summary.measurements}</p>
            </div>
            <div className="rounded-xl bg-[#F0FDF4] p-4">
              <p className="text-xs text-gray-600">Active Projects</p>
              <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{summary.active}</p>
            </div>
            <div className="rounded-xl bg-[#F5F3FF] p-4">
              <p className="text-xs text-gray-600">Paid Earnings</p>
              <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{formatCurrency(earnings.paid)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2D2D2D]">Profile Details</h2>

            <form onSubmit={handleSave} className="grid gap-3 mt-4">
              <label className="grid gap-1 text-sm text-gray-700">
                <span className="inline-flex items-center gap-2"><UserRound className="w-4 h-4" /> Full name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded-xl p-2.5"
                  placeholder="Designer full name"
                />
              </label>

              <label className="grid gap-1 text-sm text-gray-700">
                <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Specialty</span>
                <input
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  className="border rounded-xl p-2.5"
                  placeholder="e.g. Bridal and couture"
                />
              </label>

              <label className="grid gap-1 text-sm text-gray-700">
                <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="border rounded-xl p-2.5"
                  placeholder="City"
                />
              </label>

              <label className="grid gap-1 text-sm text-gray-700">
                <span>Bio</span>
                <textarea
                  name="bio"
                  rows={4}
                  value={form.bio}
                  onChange={handleChange}
                  className="border rounded-xl p-2.5"
                  placeholder="Describe your style and craft."
                />
              </label>

              <button type="submit" className="bg-[#2D2D2D] text-white rounded-xl py-2.5">
                Save Profile
              </button>
              {message ? <p className="text-sm text-[#2D2D2D]">{message}</p> : null}
            </form>
          </article>

          <article className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#2D2D2D]">Public Snapshot</h2>
              <p className="text-sm text-gray-600 mt-1">This is what clients quickly see before booking.</p>
            </div>

            <div className="rounded-xl border p-4 space-y-2">
              <p className="text-lg font-semibold text-[#2D2D2D]">{designer.name}</p>
              <p className="text-sm text-gray-700">{designer.specialty}</p>
              <p className="text-sm text-gray-600 inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {designer.location}</p>
              <p className="text-sm text-gray-600 inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {designer.email}</p>
              <p className="text-sm text-gray-700 mt-2">{designer.bio || "No bio set yet."}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[#FAFAFA] border p-3">
                <p className="text-gray-500">All Projects</p>
                <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{summary.projects}</p>
              </div>
              <div className="rounded-xl bg-[#FAFAFA] border p-3">
                <p className="text-gray-500">Completed</p>
                <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{summary.completed}</p>
              </div>
              <div className="rounded-xl bg-[#FAFAFA] border p-3">
                <p className="text-gray-500">Pending Earnings</p>
                <p className="text-lg font-semibold text-[#2D2D2D] mt-1 inline-flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  {formatCurrency(earnings.pending)}
                </p>
              </div>
              <div className="rounded-xl bg-[#FAFAFA] border p-3">
                <p className="text-gray-500">Total Earnings</p>
                <p className="text-lg font-semibold text-[#2D2D2D] mt-1">{formatCurrency(earnings.total)}</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
