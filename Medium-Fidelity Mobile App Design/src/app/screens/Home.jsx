import { Link } from "react-router";
import { Bell, Upload, Users, Package, Star, TrendingUp, ChevronRight, Search } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const featuredDesigners = [
    {
      id: 1,
      name: "Akosua Mensah",
      specialty: "Kente & Traditional",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    },
    {
      id: 2,
      name: "Kwame Asante",
      specialty: "Contemporary Fashion",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    },
    {
      id: 3,
      name: "Ama Boateng",
      specialty: "Wedding Attire",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1726142916875-814508f61e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    },
  ];

  const recentOrders = [
    { id: "ORD001", designer: "Akosua Mensah", item: "Kente Dress", status: "Sewing", amount: 350 },
    { id: "ORD002", designer: "Kwame Asante", item: "Custom Suit", status: "Ready", amount: 650 },
  ];

  const styleCategories = [
    { id: 1, name: "Traditional", count: 45, icon: "👔" },
    { id: 2, name: "Modern", count: 78, icon: "✨" },
    { id: 3, name: "Formal", count: 34, icon: "🎩" },
    { id: 4, name: "Wedding", count: 56, icon: "💒" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#4B5563] mb-1 text-sm">Welcome back,</p>
            <h1 className="text-[#2D2D2D] font-['Playfair_Display'] text-[28px] font-bold">
              Akosua Owusu
            </h1>
          </div>
          <Link to="/notifications" className="p-2 hover:bg-gray-50 rounded-xl transition-all relative">
            <Bell size={24} className="text-[#2D2D2D]" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white"></div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4B5563]" size={20} />
          <input
            type="text"
            placeholder="Search designers or styles..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#FDFDFD] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent text-[#2D2D2D] font-['Raleway']"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/measurements"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Upload size={20} className="text-[#E76F51]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm font-semibold font-['Raleway']">
                Upload
              </p>
              <p className="text-[#4B5563] text-xs font-['Raleway']">Measurements</p>
            </div>
          </Link>

          <Link
            to="/designers"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#2D2D2D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-[#2D2D2D]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm font-semibold font-['Raleway']">
                Find
              </p>
              <p className="text-[#4B5563] text-xs font-['Raleway']">Designers</p>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/80 text-sm mb-1 font-['Raleway']">Active Orders</p>
              <h2 className="text-white text-[32px] font-bold font-['Playfair_Display']">3</h2>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Package size={28} className="text-white" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/70 text-xs mb-1 font-['Raleway']">Completed</p>
              <p className="text-white text-lg font-semibold font-['Raleway']">12</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1 font-['Raleway']">Designers</p>
              <p className="text-white text-lg font-semibold font-['Raleway']">5</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1 font-['Raleway']">Spent</p>
              <p className="text-white text-lg font-semibold font-['Raleway']">GH₵2.5K</p>
            </div>
          </div>
        </div>

        {/* Featured Designers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2D2D2D] text-xl font-bold font-['Playfair_Display']">
              Featured Designers
            </h2>
            <Link to="/designers" className="text-[#E76F51] text-sm flex items-center gap-1 font-semibold font-['Raleway']">
              View All
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {featuredDesigners.map((designer) => (
              <Link
                key={designer.id}
                to={`/designer/${designer.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={designer.image}
                    alt={designer.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-[#2D2D2D] mb-1 text-base font-semibold font-['Raleway']">
                      {designer.name}
                    </h3>
                    <p className="text-[#4B5563] text-sm mb-2 font-['Raleway']">{designer.specialty}</p>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#F4A261] fill-[#F4A261]" />
                      <span className="text-[#2D2D2D] text-sm font-semibold font-['Raleway']">{designer.rating}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[#9CA3AF]" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-[#2D2D2D] mb-4 text-xl font-bold font-['Playfair_Display']">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#4B5563] text-sm font-['Raleway']">{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold font-['Raleway'] ${
                    order.status === "Ready" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#2D2D2D] mb-1 font-semibold font-['Raleway']">{order.item}</p>
                    <p className="text-[#4B5563] text-sm font-['Raleway']">{order.designer}</p>
                  </div>
                  <p className="text-[#2D2D2D] text-lg font-bold font-['Raleway']">
                    GH₵{order.amount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}