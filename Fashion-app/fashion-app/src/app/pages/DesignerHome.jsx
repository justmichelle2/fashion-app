import { Link, useNavigate } from "react-router-dom";
import { Bell, TrendingUp, Package, MessageCircle, Star, Clock, Settings, ChevronRight, LogOut, FolderKanban, CalendarClock, MessageSquare, Sparkles } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { handleLogout } from "../utils/authUtils";

export default function DesignerHome() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/landing");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] pb-20">
      <div className="mx-auto max-w-2xl px-5 py-6">
        <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-xl">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-white/70">Studio Home</p>
              <h1 className="mt-1 text-3xl font-semibold">Welcome, {(userProfile?.name || userProfile?.businessName || "Designer").split(" ")[0]}</h1>
            </div>
            <Link to="/designer/messages" className="relative rounded-xl bg-white/10 p-2 hover:bg-white/20 transition-all">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-400" />
            </Link>
          </div>

          <p className="text-sm text-white/80">
            This page is your launchpad: jump into planning, communication, and portfolio updates.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link to="/designer/portfolio" className="rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-all">
              <FolderKanban size={18} className="mb-2" />
              <p className="font-semibold">Portfolio</p>
              <p className="text-xs text-white/75">Curate your latest work</p>
            </Link>

            <Link to="/designer/measurements" className="rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-all">
              <CalendarClock size={18} className="mb-2" />
              <p className="font-semibold">Measurements</p>
              <p className="text-xs text-white/75">Keep fit details tidy</p>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link to="/designer/dashboard" className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-all">
            <div className="mb-3 inline-flex rounded-xl bg-[#EEF2FF] p-2 text-[#4338CA]">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-lg font-semibold text-[#111827]">Go to Dashboard</h2>
            <p className="mt-1 text-sm text-[#4B5563]">Manage live operations, active jobs, and incoming messages.</p>
          </Link>

          <Link to="/designer/messages" className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-all">
            <div className="mb-3 inline-flex rounded-xl bg-[#ECFDF5] p-2 text-[#047857]">
              <MessageSquare size={18} />
            </div>
            <h2 className="text-lg font-semibold text-[#111827]">Client Inbox</h2>
            <p className="mt-1 text-sm text-[#4B5563]">Reply quickly and keep customers updated without leaving flow.</p>
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-[#111827]">
            <Sparkles size={18} className="text-[#E76F51]" />
            <h3 className="font-semibold">Today’s Focus</h3>
          </div>
          <ul className="space-y-2 text-sm text-[#4B5563]">
            <li>Finalize fitting times for two pending clients.</li>
            <li>Upload one fresh portfolio piece.</li>
            <li>Send completion updates to active orders.</li>
          </ul>
        </div>

        <button
          onClick={handleLogoutClick}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100 transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
