import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Truck, MapPin, ArrowRight, AlertCircle } from "lucide-react";
import { mockOrders } from "../data/mockData";

export default function OrderTracking() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("all");

  const filtered = mockOrders.filter((order) => {
    if (selected === "all") return true;
    return order.status === selected;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "in-progress":
        return <Truck className="w-6 h-6 text-blue-500" />;
      default:
        return <Clock className="w-6 h-6 text-[#E76F51]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-700";
      case "in-progress":
        return "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return "bg-[#E76F51]/10 border-[#E76F51]/30 text-[#E76F51]";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6">
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display']">Order Tracking</h1>
        <p className="text-[#6B6B6B] text-sm font-['Raleway']">Monitor your orders</p>

        {/* Filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {["all", "pending", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setSelected(status)}
              className={`px-4 py-2 rounded-full text-sm font-['Raleway'] font-semibold transition whitespace-nowrap capitalize ${
                selected === status
                  ? "bg-[#E76F51] text-white"
                  : "bg-white text-[#6B6B6B] border border-[#E76F51]/20 hover:border-[#E76F51]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#E76F51]/30 mx-auto mb-4" />
            <p className="text-[#6B6B6B] font-['Raleway']">No orders in this category</p>
          </div>
        ) : (
          filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-[#E76F51]/10 hover:border-[#E76F51]/30 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display']">Order #{order.id}</h3>
                  <p className="text-[#6B6B6B] text-sm font-['Raleway']">{order.date}</p>
                </div>

                <div className={`px-4 py-2 rounded-full border font-['Raleway'] font-semibold text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#6B6B6B]" />
                  <p className="text-[#6B6B6B] text-sm font-['Raleway']">Designer: {order.designer}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E76F51]/10">
                  <p className="text-[#2D2D2D] font-bold font-['Raleway']">₵{order.amount}</p>
                  <ArrowRight className="w-5 h-5 text-[#E76F51]" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
