import { Link } from "react-router";
import { Bell, TrendingUp, Package, MessageCircle, Star, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function DesignerHome() {
  const todayOrders = [
    { id: "ORD001", customer: "Akosua Owusu", style: "Kente Dress", status: "Sewing", amount: 350, time: "2h ago" },
    { id: "ORD002", customer: "Kofi Asante", style: "Traditional Wear", status: "Ready", amount: 420, time: "4h ago" },
  ];

  const recentMessages = [
    { id: "1", customer: "Efua Mensah", message: "When will my dress be ready?", time: "1h ago", unread: true },
    { id: "2", customer: "Yaw Ofori", message: "Thank you for the update!", time: "3h ago", unread: false },
  ];

  const upcomingDeadlines = [
    { orderId: "ORD003", customer: "Abena Mensah", item: "Ankara Suit", deadline: "Tomorrow", priority: "high" },
    { orderId: "ORD004", customer: "Kwaku Boateng", item: "Custom Shirt", deadline: "In 3 days", priority: "medium" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-6">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#4B5563] mb-1 text-sm">Welcome back,</p>
            <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "28px", fontWeight: "700" }}>
              Akosua Mensah
            </h1>
          </div>
          <Link to="/notifications" className="p-2 hover:bg-gray-50 rounded-xl transition-all relative">
            <Bell size={24} className="text-[#2D2D2D]" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white"></div>
          </Link>
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
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/designer-dashboard"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-[#E76F51]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                View Orders
              </p>
              <p className="text-[#4B5563] text-xs">8 active</p>
            </div>
          </Link>

          <Link
            to="/designer-dashboard"
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
        </div>

        {/* Today's Earnings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
              Today's Earnings
            </h3>
            <TrendingUp size={20} className="text-[#10B981]" />
          </div>
          <p className="text-[#E76F51] font-['Playfair_Display'] mb-2" style={{ fontSize: "32px", fontWeight: "700" }}>
            GH₵770
          </p>
          <p className="text-[#4B5563] text-sm">From 2 completed orders</p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
              Today's Orders
            </h3>
            <Link to="/designer-dashboard" className="text-[#E76F51] text-sm" style={{ fontWeight: "600" }}>
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {todayOrders.map((order, index) => (
              <div key={order.id} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#2D2D2D] mb-0.5" style={{ fontWeight: "600" }}>
                      {order.customer}
                    </p>
                    <p className="text-[#4B5563] text-sm">{order.style}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Ready" ? "bg-[#10B981]/10 text-[#10B981]" :
                        "bg-[#F4A261]/10 text-[#F4A261]"
                      }`} style={{ fontWeight: "600" }}>
                        {order.status}
                      </span>
                      <span className="text-[#4B5563] text-xs">{order.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#E76F51] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                      GH₵{order.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
              Recent Messages
            </h3>
            <Link to="/designer-dashboard" className="text-[#E76F51] text-sm" style={{ fontWeight: "600" }}>
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <Link
                key={msg.id}
                to={`/chat/${msg.id}`}
                className="flex items-start gap-3 p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51]/30 transition-all"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                      {msg.customer.charAt(0)}
                    </span>
                  </div>
                  {msg.unread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F97316] rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>
                      {msg.customer}
                    </p>
                    <span className="text-[#4B5563] text-xs flex-shrink-0 ml-2">{msg.time}</span>
                  </div>
                  <p className="text-[#4B5563] text-sm truncate">{msg.message}</p>
                </div>
                <ChevronRight size={20} className="text-[#4B5563] flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
              Upcoming Deadlines
            </h3>
            <Clock size={20} className="text-[#F97316]" />
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map((item) => (
              <div key={item.orderId} className="flex items-center gap-3 p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                <div className={`w-2 h-12 rounded-full flex-shrink-0 ${
                  item.priority === "high" ? "bg-[#EF4444]" : "bg-[#F4A261]"
                }`}></div>
                <div className="flex-1">
                  <p className="text-[#2D2D2D] mb-0.5" style={{ fontWeight: "600" }}>
                    {item.customer}
                  </p>
                  <p className="text-[#4B5563] text-sm">{item.item}</p>
                  <p className="text-[#4B5563] text-xs">Order #{item.orderId}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${
                    item.priority === "high" ? "text-[#EF4444]" : "text-[#F4A261]"
                  }`} style={{ fontWeight: "600" }}>
                    {item.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance This Week */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
            This Week's Performance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
              <span className="text-[#4B5563] text-sm">Orders Completed</span>
              <span className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                12
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
              <span className="text-[#4B5563] text-sm">Revenue</span>
              <span className="text-[#E76F51] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                GH₵2,400
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
              <span className="text-[#4B5563] text-sm">Avg. Response Time</span>
              <span className="text-[#10B981] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                2.5h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
