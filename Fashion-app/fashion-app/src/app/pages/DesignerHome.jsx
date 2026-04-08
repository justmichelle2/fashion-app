import { Link, useNavigate } from "react-router-dom";
import { Bell, TrendingUp, Package, MessageCircle, Star, Clock, CheckCircle, ChevronRight, LogOut, Settings } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { handleLogout } from "../utils/authUtils";

export default function DesignerHome() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/landing");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#4B5563] mb-1 text-sm">Welcome back,</p>
            <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "28px", fontWeight: "700" }}>
              Akosua Mensah
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/designer-profile" className="p-2 hover:bg-gray-50 rounded-xl transition-all">
              <Settings size={24} className="text-[#2D2D2D]" />
            </Link>
            <Link to="/notifications" className="p-2 hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell size={24} className="text-[#2D2D2D]" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white"></div>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-3xl p-6">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <Package size={20} className="text-white" />
              </div>
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                8
              </p>
              <p className="text-white/90 text-xs">Active</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock size={20} className="text-white" />
              </div>
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                3
              </p>
              <p className="text-white/90 text-xs">Pending</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <MessageCircle size={20} className="text-white" />
              </div>
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                5
              </p>
              <p className="text-white/90 text-xs">Messages</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star size={20} className="text-white" />
              </div>
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "20px", fontWeight: "700" }}>
                4.8
              </p>
              <p className="text-white/90 text-xs">Rating</p>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-6">
          <Link
            to="/designer-progress"
            className="px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            style={{ fontWeight: "600" }}
          >
            Progress
          </Link>
          <Link
            to="/designer-portfolio"
            className="px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            style={{ fontWeight: "600" }}
          >
            Portfolio
          </Link>
          <Link
            to="/designer-orders"
            className="px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            style={{ fontWeight: "600" }}
          >
            Orders
          </Link>
          <Link
            to="/designer-messages"
            className="px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            style={{ fontWeight: "600" }}
          >
            Messages
          </Link>
          <Link
            to="/designer-measurements"
            className="px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            style={{ fontWeight: "600" }}
          >
            Measurements
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/designer-progress"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-[#E76F51]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                Progress
              </p>
              <p className="text-[#4B5563] text-xs">View earnings</p>
            </div>
          </Link>

          <Link
            to="/designer-orders"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#F4A261]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-[#F4A261]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                Orders
              </p>
              <p className="text-[#4B5563] text-xs">12 active</p>
            </div>
          </Link>

          <Link
            to="/designer-messages"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-[#10B981]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                Messages
              </p>
              <p className="text-[#4B5563] text-xs">5 unread</p>
            </div>
          </Link>

          <Link
            to="/designer-measurements"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#6366F1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-[#6366F1]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                Measurements
              </p>
              <p className="text-[#4B5563] text-xs">3 records</p>
            </div>
          </Link>
        </div>

        {/* Portfolio Card */}
        <Link
          to="/designer-portfolio"
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
              Portfolio
            </h3>
            <ChevronRight size={20} className="text-[#4B5563]" />
          </div>
          <p className="text-[#4B5563] text-sm">Upload and manage your designs</p>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-lg font-semibold hover:bg-red-100 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
      </div>
    </div>
  );
}
