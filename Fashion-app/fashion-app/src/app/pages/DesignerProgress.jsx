import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DesignerProgress() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [weeklyEarnings, setWeeklyEarnings] = useState([
    { day: "Mon", amount: 450 },
    { day: "Tue", amount: 600 },
    { day: "Wed", amount: 500 },
    { day: "Thu", amount: 700 },
    { day: "Fri", amount: 800 },
    { day: "Sat", amount: 900 },
    { day: "Sun", amount: 650 },
  ]);

  const goals = [
    { title: "Earn GH₵5,000 this month", current: 3200, target: 5000, color: "#E63946" },
    { title: "Maintain 4.8+ rating", current: 4.8, target: 5.0, color: "#D4AF37" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} className="text-[#2D2D2D]" />
          </button>
          <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
            Progress
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* This Week Earnings Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
                This Week's Revenue
              </h2>
              <TrendingUp size={20} className="text-[#D4AF37]" />
            </div>
            <div className="flex items-end justify-between h-40 gap-2">
              {weeklyEarnings.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#E63946] to-[#D4AF37] rounded-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.amount / 1000) * 100}px` }}
                    ></div>
                  </div>
                  <span className="text-[#2D3436] text-xs font-semibold">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-[#E63946]/10 rounded-2xl">
              <p className="text-[#E63946] font-semibold">Total: GH₵4,600</p>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              This Month's Goals
            </h2>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#2D2D2D] font-semibold text-sm">{goal.title}</span>
                    <span className="text-[#2D3436] text-xs font-semibold">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                        backgroundColor: goal.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Performance Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 text-center">
                <p className="text-[#E63946] font-['Playfair_Display'] font-bold text-2xl">12</p>
                <p className="text-[#2D3436] text-xs mt-1">Orders This Week</p>
              </div>
              <div className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 text-center">
                <p className="text-[#D4AF37] font-['Playfair_Display'] font-bold text-2xl">4.8</p>
                <p className="text-[#2D3436] text-xs mt-1">Average Rating</p>
              </div>
              <div className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 text-center">
                <p className="text-[#D4AF37] font-['Playfair_Display'] font-bold text-2xl">98%</p>
                <p className="text-[#2D3436] text-xs mt-1">Completion Rate</p>
              </div>
              <div className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 text-center">
                <p className="text-[#E63946] font-['Playfair_Display'] font-bold text-2xl">2.5h</p>
                <p className="text-[#2D3436] text-xs mt-1">Avg Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
