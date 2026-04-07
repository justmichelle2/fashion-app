import { Link } from "react-router";
import { Settings, Heart, Package, Star, TrendingUp, ChevronRight, User, Phone, Mail, MapPin, LogOut } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

export function CustomerProfile() {
  const [activeTab, setActiveTab] = useState<"progress" | "orders" | "favorites">("progress");

  const savedMeasurements = {
    chest: "38",
    waist: "32",
    hips: "40",
    shoulder: "16",
    wrist: "6.5",
    height: "5'8\"",
    unit: "inches"
  };

  const weeklyStats = [
    { day: "Mon", orders: 0 },
    { day: "Tue", orders: 1 },
    { day: "Wed", orders: 0 },
    { day: "Thu", orders: 2 },
    { day: "Fri", orders: 1 },
    { day: "Sat", orders: 0 },
    { day: "Sun", orders: 0 },
  ];

  const recentOrders = [
    { id: 1, designer: "Akosua Mensah", item: "Kente Dress", date: "Feb 28, 2026", amount: 350, status: "Sewing" },
    { id: 2, designer: "Kwame Asante", item: "Custom Suit", date: "Feb 20, 2026", amount: 650, status: "Ready" },
    { id: 3, designer: "Ama Boateng", item: "Ankara Dress", date: "Mar 1, 2026", amount: 280, status: "Pending" },
  ];

  const favoriteDesigners = [
    { name: "Akosua Mensah", specialty: "Kente & Traditional", rating: 4.9 },
    { name: "Kwame Asante", specialty: "Contemporary Fashion", rating: 4.8 },
    { name: "Ama Boateng", specialty: "Wedding Attire", rating: 5.0 },
  ];

  const maxOrders = Math.max(...weeklyStats.map(s => s.orders), 1);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Clean Header - Matching Designer Dashboard */}
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Link to="/home" className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ChevronRight size={24} className="text-[#2D2D2D] rotate-180" />
          </Link>
          <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "28px", fontWeight: "700" }}>
            Profile
          </h1>
          <Link to="/settings" className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <Settings size={24} className="text-[#2D2D2D]" />
          </Link>
        </div>

        {/* Profile Card - Matching Designer Dashboard */}
        <div className="bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex-shrink-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-white mb-1" style={{ fontSize: "20px", fontWeight: "700" }}>
                Akosua Owusu
              </h2>
              <p className="text-white/90 text-sm">Customer • Accra, Ghana</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                12
              </p>
              <p className="text-white/90 text-xs">Orders</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                5
              </p>
              <p className="text-white/90 text-xs">Favorites</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-white font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                4.2K
              </p>
              <p className="text-white/90 text-xs">Spent</p>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-6 py-2.5 rounded-full text-sm transition-all ${
              activeTab === "progress"
                ? "bg-[#E76F51] text-white"
                : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            }`}
            style={{ fontWeight: "600" }}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 rounded-full text-sm transition-all ${
              activeTab === "orders"
                ? "bg-[#E76F51] text-white"
                : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            }`}
            style={{ fontWeight: "600" }}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-2.5 rounded-full text-sm transition-all ${
              activeTab === "favorites"
                ? "bg-[#E76F51] text-white"
                : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
            }`}
            style={{ fontWeight: "600" }}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Progress Tab */}
        {activeTab === "progress" && (
          <>
            {/* This Week Stats */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                This week
              </h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-[#4B5563] text-xs mb-1">Orders</p>
                  <p className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                    4
                  </p>
                </div>
                <div>
                  <p className="text-[#4B5563] text-xs mb-1">Spent</p>
                  <p className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                    GH₵1.3K
                  </p>
                </div>
                <div>
                  <p className="text-[#4B5563] text-xs mb-1">Reviews</p>
                  <p className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
                    2
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-40 flex items-end justify-between gap-2">
                {weeklyStats.map((stat, index) => (
                  <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-32">
                      <div
                        className="w-full bg-gradient-to-t from-[#E76F51] to-[#F4A261] rounded-t-lg transition-all relative group"
                        style={{ height: `${(stat.orders / maxOrders) * 100}%`, minHeight: stat.orders > 0 ? '20%' : '0%' }}
                      >
                        {stat.orders > 0 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-[#2D2D2D] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                              {stat.orders}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[#4B5563] text-xs">{stat.day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
                  Goals
                </h3>
                <button className="text-[#E76F51] text-sm" style={{ fontWeight: "600" }}>
                  See all →
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E76F51]/10 flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-[#E76F51]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>
                        Complete 5 orders
                      </p>
                      <span className="text-[#E76F51] text-sm" style={{ fontWeight: "700" }}>4/5</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#E76F51] to-[#F4A261]" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-[#10B981]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>
                        Leave 3 reviews
                      </p>
                      <span className="text-[#10B981] text-sm" style={{ fontWeight: "700" }}>2/3</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10B981]" style={{ width: "66%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
                  Measurements
                </h3>
                <Link to="/measurements" className="text-[#E76F51] text-sm" style={{ fontWeight: "600" }}>
                  Edit
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(savedMeasurements)
                  .filter(([key]) => key !== "unit")
                  .map(([key, value]) => (
                    <div key={key} className="bg-[#FDFDFD] rounded-2xl p-3 border border-gray-50 text-center">
                      <p className="text-[#4B5563] text-xs mb-1 capitalize">{key}</p>
                      <p className="text-[#2D2D2D]" style={{ fontWeight: "700" }}>
                        {value}
                      </p>
                    </div>
                  ))}
              </div>
              <p className="text-[#4B5563] text-xs mt-3 text-center">
                Unit: <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>{savedMeasurements.unit}</span>
              </p>
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            {/* Recent Orders */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
                  Recent Orders
                </h3>
                <Link to="/orders" className="text-[#E76F51] text-sm" style={{ fontWeight: "600" }}>
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div key={order.id} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#2D2D2D] mb-0.5" style={{ fontWeight: "600" }}>
                          {order.designer}
                        </p>
                        <p className="text-[#4B5563] text-sm">{order.item}</p>
                        <p className="text-[#4B5563] text-xs">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs mb-1 inline-block ${
                          order.status === "Ready" ? "bg-[#10B981]/10 text-[#10B981]" :
                          order.status === "Sewing" ? "bg-[#F4A261]/10 text-[#F4A261]" :
                          "bg-[#E76F51]/10 text-[#E76F51]"
                        }`} style={{ fontWeight: "600" }}>
                          {order.status}
                        </span>
                        <p className="text-[#E76F51] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                          GH₵{order.amount}
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all" style={{ fontWeight: "600" }}>
                      Track Order
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Statistics */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <span className="text-[#4B5563] text-sm">Total Orders</span>
                  <span className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                    12
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <span className="text-[#4B5563] text-sm">Total Spent</span>
                  <span className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                    GH₵4.2K
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <span className="text-[#4B5563] text-sm">Avg. Order Value</span>
                  <span className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "18px" }}>
                    GH₵350
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <>
            {/* Favorite Designers */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2D2D2D]" style={{ fontSize: "18px", fontWeight: "700" }}>
                  Favorite Designers
                </h3>
                <Link to="/designers" className="text-[#E76F51] text-sm" style={{ fontWeight: "600" }}>
                  Browse →
                </Link>
              </div>
              <div className="space-y-3">
                {favoriteDesigners.map((designer, index) => (
                  <div key={index} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                          {designer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#2D2D2D] truncate mb-0.5" style={{ fontWeight: "600" }}>
                          {designer.name}
                        </p>
                        <p className="text-[#4B5563] text-sm">{designer.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Star size={14} className="text-[#F4A261] fill-[#F4A261]" />
                        <span className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                          {designer.rating}
                        </span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all" style={{ fontWeight: "600" }}>
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="w-10 h-10 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#E76F51]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#4B5563] text-xs mb-0.5">Phone</p>
                    <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "500" }}>+233 24 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="w-10 h-10 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#E76F51]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#4B5563] text-xs mb-0.5">Email</p>
                    <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "500" }}>akosua.owusu@email.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="w-10 h-10 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#E76F51]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#4B5563] text-xs mb-0.5">Location</p>
                    <p className="text-[#2D2D2D] text-sm" style={{ fontWeight: "500" }}>Accra, Ghana</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Account
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51]/30 transition-all">
                  <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>Edit Profile</span>
                  <ChevronRight size={20} className="text-[#4B5563]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51]/30 transition-all">
                  <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>Payment Methods</span>
                  <ChevronRight size={20} className="text-[#4B5563]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51]/30 transition-all">
                  <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>Settings</span>
                  <ChevronRight size={20} className="text-[#4B5563]" />
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <button className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/5 transition-all shadow-sm">
              <LogOut size={20} />
              <span style={{ fontWeight: "600" }}>Sign Out</span>
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
