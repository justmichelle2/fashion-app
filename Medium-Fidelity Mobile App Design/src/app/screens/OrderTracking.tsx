import { Link } from "react-router";
import { ArrowLeft, Package, Clock, CheckCircle, TruckIcon } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockOrders } from "../data/mockData";

export function OrderTracking() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#F97316] bg-[#F97316]/10";
      case "Sewing":
        return "text-[#EAB308] bg-[#EAB308]/10";
      case "Ready":
        return "text-[#006D5B] bg-[#006D5B]/10";
      case "Delivered":
        return "text-[#10B981] bg-[#10B981]/10";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;
      case "Sewing":
        return <Package size={16} />;
      case "Ready":
        return <CheckCircle size={16} />;
      case "Delivered":
        return <TruckIcon size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const orderImages = [
    "https://images.unsplash.com/photo-1710559056465-6a71e5089342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFzaGlvbiUyMGtlbnRlJTIwZHJlc3N8ZW58MXx8fHwxNzcyNjI0MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1621945094361-aed061046504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0YWlsb3JlZCUyMHN1aXQlMjBHaGFuYXxlbnwxfHx8fDE3NzI2MjQxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1760907949889-eb62b7fd9f75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYW5rYXJhJTIwcHJpbnQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzI2MjQxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/home" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#111827]" />
          </Link>
          <h1 className="text-[#111827]" style={{ fontSize: "24px", fontWeight: "700" }}>
            My Orders
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <button className="px-4 py-2 bg-[#EAB308] text-white rounded-full whitespace-nowrap">
            Active
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-[#111827] rounded-full whitespace-nowrap hover:border-[#EAB308]">
            Completed
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-[#111827] rounded-full whitespace-nowrap hover:border-[#EAB308]">
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 py-6 space-y-4">
        {mockOrders.map((order, index) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 mb-4">
              {/* Order Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                <ImageWithFallback
                  src={orderImages[index]}
                  alt={order.style}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[#111827]" style={{ fontWeight: "600", fontSize: "16px" }}>
                    {order.style}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(order.status)}`}
                    style={{ fontWeight: "600" }}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                
                <p className="text-[#4B5563] text-sm mb-1">{order.designerName}</p>
                <p className="text-[#4B5563] text-sm">Order #{order.id}</p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {/* Progress Steps */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === "Pending" || order.status === "Sewing" || order.status === "Ready" || order.status === "Delivered"
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      <CheckCircle size={16} />
                    </div>
                    <div className={`flex-1 h-1 ${
                      order.status === "Sewing" || order.status === "Ready" || order.status === "Delivered"
                        ? "bg-[#10B981]"
                        : "bg-gray-200"
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === "Sewing" || order.status === "Ready" || order.status === "Delivered"
                        ? "bg-[#10B981] text-white"
                        : order.status === "Sewing" ? "bg-[#EAB308] text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      <Package size={16} />
                    </div>
                    <div className={`flex-1 h-1 ${
                      order.status === "Ready" || order.status === "Delivered"
                        ? "bg-[#10B981]"
                        : "bg-gray-200"
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === "Ready" || order.status === "Delivered"
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      <TruckIcon size={16} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#4B5563]">Placed</span>
                    <span className="text-xs text-[#4B5563]">Sewing</span>
                    <span className="text-xs text-[#4B5563]">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Footer */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#4B5563] text-sm">Total Amount</p>
                <p className="text-[#EAB308]" style={{ fontWeight: "700", fontSize: "18px" }}>
                  GH₵ {order.amount}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 text-[#111827] rounded-lg hover:border-[#EAB308] transition-colors text-sm">
                  View Details
                </button>
                <Link
                  to={`/chat/${order.designerId}`}
                  className="px-4 py-2 bg-[#EAB308] text-white rounded-lg hover:bg-[#CA9A04] transition-colors text-sm"
                >
                  Message
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
