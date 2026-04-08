import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DesignerOrders() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);

  const activeOrders = [
    { id: "ORD001", customer: "Akosua Owusu", item: "Kente Dress", status: "In Progress", dueDate: "2 days left", amount: 350, progress: 65 },
    { id: "ORD002", customer: "Ama Boateng", item: "Wedding Gown", status: "In Progress", dueDate: "5 days left", amount: 1200, progress: 40 },
    { id: "ORD003", customer: "Efua Mensah", item: "Traditional Suit", status: "Ready for Pickup", dueDate: "Today", amount: 420, progress: 100 },
  ];

  const upcomingOrders = [
    { id: "ORD004", customer: "Kofi Asante", item: "Custom Shirt", orderDate: "Tomorrow", amount: 150 },
    { id: "ORD005", customer: "Yaw Boateng", item: "Ankara Pants", orderDate: "In 2 days", amount: 180 },
  ];

  const completedOrders = [
    { id: "ORD006", customer: "Abena Mensah", item: "Evening Dress", completedDate: "2 days ago", amount: 500, rating: 5 },
    { id: "ORD007", customer: "Kwaku Boateng", item: "Traditional Wear", completedDate: "1 week ago", amount: 450, rating: 4.8 },
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
            Orders
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Active Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Active Orders
            </h2>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div key={order.id} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[#2D2D2D] font-semibold">{order.customer}</p>
                      <p className="text-[#4B5563] text-sm">{order.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#E76F51] font-semibold">GH₵{order.amount}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#4B5563]">Progress</span>
                      <span className="text-xs font-semibold text-[#E76F51]">{order.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] rounded-full"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Ready for Pickup"
                        ? "bg-[#10B981]/10 text-[#10B981] font-semibold"
                        : "bg-[#F4A261]/10 text-[#F4A261] font-semibold"
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-[#4B5563] flex items-center gap-1">
                      <Clock size={14} /> {order.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Upcoming Orders
            </h2>
            <div className="space-y-3">
              {upcomingOrders.map((order) => (
                <div key={order.id} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[#2D2D2D] font-semibold">{order.customer}</p>
                    <p className="text-[#4B5563] text-sm">{order.item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#E76F51] font-semibold">GH₵{order.amount}</p>
                    <p className="text-[#4B5563] text-xs">{order.orderDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Completed Orders
            </h2>
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <div key={order.id} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[#2D2D2D] font-semibold">{order.customer}</p>
                      <p className="text-[#4B5563] text-sm">{order.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#10B981] font-semibold flex items-center gap-1"><CheckCircle size={16} /> Completed</p>
                      <p className="text-[#4B5563] text-xs">{order.completedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#E76F51] font-semibold">GH₵{order.amount}</span>
                    <span className="text-[#10B981]">⭐ {order.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
