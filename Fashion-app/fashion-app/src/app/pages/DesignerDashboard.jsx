import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, Calendar, ClipboardList, Settings } from "lucide-react";

export default function DesignerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-[#F5E6D3] flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-[#2D2D2D]" />
        </button>
        <div>
          <h1 className="text-[#2D2D2D] text-xl font-bold font-['Playfair_Display']">Dashboard</h1>
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Manage your business</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Total Orders", value: "42", icon: "📦" },
          { label: "Pending Tasks", value: "5", icon: "⏳" },
          { label: "This Month", value: "₵8,500", icon: "💰" },
          { label: "New Orders", value: "3", icon: "✨" },
        ].map((metric, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
            <p className="text-[#6B6B6B] text-xs font-['Raleway'] mb-2">{metric.label}</p>
            <p className="text-3xl mb-1">{metric.icon}</p>
            <p className="text-[#2D2D2D] text-xl font-bold font-['Raleway']">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="p-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-xl p-5 border border-[#E76F51]/10 hover:shadow-md transition flex flex-col items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#E76F51]" />
            <span className="text-[#2D2D2D] font-semibold text-sm text-center font-['Raleway']">Pending Orders</span>
          </button>

          <button className="bg-white rounded-xl p-5 border border-[#E76F51]/10 hover:shadow-md transition flex flex-col items-center gap-2">
            <Users className="w-6 h-6 text-[#E76F51]" />
            <span className="text-[#2D2D2D] font-semibold text-sm text-center font-['Raleway']">My Clients</span>
          </button>

          <button className="bg-white rounded-xl p-5 border border-[#E76F51]/10 hover:shadow-md transition flex flex-col items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#E76F51]" />
            <span className="text-[#2D2D2D] font-semibold text-sm text-center font-['Raleway']">Analytics</span>
          </button>

          <button className="bg-white rounded-xl p-5 border border-[#E76F51]/10 hover:shadow-md transition flex flex-col items-center gap-2">
            <Settings className="w-6 h-6 text-[#E76F51]" />
            <span className="text-[#2D2D2D] font-semibold text-sm text-center font-['Raleway']">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6">
        <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "New order received", time: "2 hours ago" },
            { action: "Order completed", time: "1 day ago" },
            { action: "Positive review received", time: "3 days ago" },
          ].map((activity, i) => (
            <div key={i} className="bg-white rounded-lg p-4 flex items-center justify-between border border-[#E76F51]/10">
              <div>
                <p className="text-[#2D2D2D] font-semibold font-['Raleway']">{activity.action}</p>
                <p className="text-[#6B6B6B] text-xs font-['Raleway']">{activity.time}</p>
              </div>
              <span className="text-xl">📌</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
