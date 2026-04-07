import { Link } from "react-router-dom";
import { Bell, Upload, Users, Star, Search } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import ImageWithFallback from "../components/figma/ImageWithFallback";

export default function Home() {
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
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#4B5563] mb-1 text-sm">Welcome back,</p>
            <h1 className="text-[#2D2D2D] font-heading text-[28px] font-bold">Akosua Owusu</h1>
          </div>
          <button type="button" className="p-2 hover:bg-gray-50 rounded-xl transition-all relative" aria-label="Notifications">
            <Bell size={24} className="text-[#2D2D2D]" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4B5563]" size={20} />
          <input
            type="text"
            placeholder="Search designers or styles..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#FDFDFD] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent text-[#2D2D2D]"
          />
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/measurements" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all">
            <div className="w-12 h-12 bg-[#E76F51]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Upload size={20} className="text-[#E76F51]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm font-semibold">Upload</p>
              <p className="text-[#4B5563] text-xs">Measurements</p>
            </div>
          </Link>

          <Link to="/designers" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E76F51]/30 transition-all">
            <div className="w-12 h-12 bg-[#2D2D2D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-[#2D2D2D]" />
            </div>
            <div className="flex-1">
              <p className="text-[#2D2D2D] text-sm font-semibold">Find</p>
              <p className="text-[#4B5563] text-xs">Designer</p>
            </div>
          </Link>
        </div>

        {recentOrders.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#2D2D2D] text-[18px] font-bold">Your Orders</h3>
              <Link to="/orders" className="text-[#E76F51] text-sm font-semibold">View all →</Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div key={order.id} className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-heading font-bold text-[16px]">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#2D2D2D] mb-0.5 font-semibold">{order.designer}</p>
                      <p className="text-[#4B5563] text-sm">{order.item}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${order.status === "Ready" ? "bg-[#10B981]/10 text-[#10B981]" : order.status === "Sewing" ? "bg-[#F4A261]/10 text-[#F4A261]" : "bg-[#E76F51]/10 text-[#E76F51]"}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[#E76F51] font-heading font-bold text-[18px]">GH₵{order.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2D2D2D] text-[18px] font-bold">Featured Designers</h3>
            <Link to="/designers" className="text-[#E76F51] text-sm font-semibold">View all →</Link>
          </div>

          <div className="space-y-3">
            {featuredDesigners.map((designer) => (
              <Link key={designer.id} to={`/designer/${designer.id}`} className="flex items-center gap-3 p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51]/30 transition-all">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex-shrink-0">
                  <ImageWithFallback src={designer.image} alt={designer.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#2D2D2D] mb-0.5 truncate font-semibold">{designer.name}</p>
                  <p className="text-[#4B5563] text-sm">{designer.specialty}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Star size={14} className="text-[#F4A261] fill-[#F4A261]" />
                  <span className="text-[#2D2D2D] text-sm font-semibold">{designer.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[#2D2D2D] mb-4 text-[18px] font-bold">Browse by Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {styleCategories.map((category) => (
              <Link key={category.id} to="/designers" className="p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51]/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[20px]">{category.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#2D2D2D] font-semibold">{category.name}</h4>
                    <p className="text-[#4B5563] text-xs">{category.count} designs</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[#2D2D2D] mb-4 text-[18px] font-bold">Your Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
              <span className="text-[#4B5563] text-sm">Total Orders</span>
              <span className="text-[#2D2D2D] font-heading font-bold text-[18px]">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
              <span className="text-[#4B5563] text-sm">Favorite Designers</span>
              <span className="text-[#2D2D2D] font-heading font-bold text-[18px]">5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD] rounded-2xl border border-gray-50">
              <span className="text-[#4B5563] text-sm">Total Spent</span>
              <span className="text-[#E76F51] font-heading font-bold text-[18px]">GH₵4.2K</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-3xl p-6 text-white">
          <h3 className="text-white mb-2 text-[18px] font-bold">💡 Helpful Tip</h3>
          <p className="text-white/90 text-sm mb-4">Upload your measurements now to get faster quotes from designers!</p>
          <Link to="/measurements" className="inline-block px-6 py-2.5 bg-white text-[#E76F51] rounded-xl hover:bg-white/90 transition-all font-semibold">Upload Measurements</Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
