import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

export default function DesignerHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-[#E76F51] to-[#F4A261] text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-['Playfair_Display']">Welcome, Designer</h1>
            <p className="text-white/80 font-['Raleway'] text-sm">Manage your portfolio and orders</p>
          </div>
          <button
            onClick={() => navigate("/designer-dashboard")}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <TrendingUp className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Active Orders</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">12</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <Users className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Total Clients</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">48</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <DollarSign className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Monthly Earnings</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">₵5,240</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/10">
          <Clock className="w-6 h-6 text-[#E76F51] mb-3" />
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Avg Turnaround</p>
          <p className="text-[#2D2D2D] text-2xl font-bold font-['Raleway']">7 days</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => navigate("/designer-dashboard")}
          className="w-full h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold text-lg shadow-lg transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Portfolio
        </button>

        <button className="w-full h-12 bg-white border-2 border-[#E76F51] text-[#E76F51] rounded-full font-['Raleway'] font-semibold hover:bg-[#E76F51]/5 transition">
          View All Orders
        </button>
      </div>

      {/* Recent Orders */}
      <div className="p-6">
        <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-[#E76F51]/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#2D2D2D] font-semibold font-['Raleway']">Custom Dress Order #{i}</h3>
                  <p className="text-[#6B6B6B] text-sm font-['Raleway']">Sarah M. • 3 days ago</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">In Progress</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
