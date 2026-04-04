import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, AlertCircle, Settings, LogOut } from "lucide-react";

export default function AminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-['Playfair_Display']">Admin Panel</h1>
            <p className="text-white/80 font-['Raleway'] text-sm">System management & monitoring</p>
          </div>
          <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            ⚙️
          </button>
        </div>
      </div>

      {/* System Stats */}
      <div className="p-6 grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Total Users", value: "1,240", icon: "👥" },
          { label: "Active Designers", value: "185", icon: "👨‍🎨" },
          { label: "Total Orders", value: "3,542", icon: "📦" },
          { label: "Platform Revenue", value: "₵45,230", icon: "💰" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
            <p className="text-[#6B6B6B] text-xs font-['Raleway'] mb-2">{stat.label}</p>
            <p className="text-3xl mb-1">{stat.icon}</p>
            <p className="text-[#2D2D2D] text-lg font-bold font-['Raleway']">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 space-y-3">
        <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Management</h2>

        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10 hover:shadow-md transition">
          <Users className="w-6 h-6 text-[#E76F51]" />
          <div className="text-left flex-1">
            <p className="text-[#2D2D2D] font-semibold font-['Raleway']">User Management</p>
            <p className="text-[#6B6B6B] text-xs font-['Raleway']">Manage users & permissions</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10 hover:shadow-md transition">
          <TrendingUp className="w-6 h-6 text-[#E76F51]" />
          <div className="text-left flex-1">
            <p className="text-[#2D2D2D] font-semibold font-['Raleway']">Analytics & Reports</p>
            <p className="text-[#6B6B6B] text-xs font-['Raleway']">View system statistics</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10 hover:shadow-md transition">
          <AlertCircle className="w-6 h-6 text-[#E76F51]" />
          <div className="text-left flex-1">
            <p className="text-[#2D2D2D] font-semibold font-['Raleway']">Flagged Content</p>
            <p className="text-[#6B6B6B] text-xs font-['Raleway']">Review reported items</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10 hover:shadow-md transition">
          <Settings className="w-6 h-6 text-[#E76F51]" />
          <div className="text-left flex-1">
            <p className="text-[#2D2D2D] font-semibold font-['Raleway']">System Settings</p>
            <p className="text-[#6B6B6B] text-xs font-['Raleway']">Configure platform options</p>
          </div>
        </button>
      </div>

      {/* Recent Alerts */}
      <div className="p-6">
        <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">System Alerts</h2>
        <div className="space-y-3">
          {[
            { level: "warning", message: "High traffic detected", time: "5 min ago" },
            { level: "info", message: "System backup completed", time: "1 hour ago" },
          ].map((alert, i) => (
            <div
              key={i}
              className={`rounded-lg p-4 border ${
                alert.level === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold font-['Raleway'] ${alert.level === "warning" ? "text-yellow-800" : "text-blue-800"}`}>
                    {alert.message}
                  </p>
                  <p className={`text-xs font-['Raleway'] ${alert.level === "warning" ? "text-yellow-600" : "text-blue-600"}`}>
                    {alert.time}
                  </p>
                </div>
                <span className="text-xl">⚠️</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="p-6">
        <button className="w-full bg-red-50 rounded-xl p-4 flex items-center gap-4 border border-red-200 hover:border-red-300 transition">
          <LogOut className="w-6 h-6 text-red-600" />
          <span className="text-red-600 font-semibold font-['Raleway']">Logout</span>
        </button>
      </div>
    </div>
  );
}
