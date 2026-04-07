import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Filter, Search, TrendingUp, Award, Clock } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { mockDesigners } from "../data/mockData";
import { useState } from "react";

export default function DesignerList() {
  const [activeFilter, setActiveFilter] = useState("all");

  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1726142916875-814508f61e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1620511450270-47162b983078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  ];

  const filters = [
    { id: "all", label: "All Designers", icon: null },
    { id: "top", label: "Top Rated", icon: Award },
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "available", label: "Available", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden h-[90vh] sm:h-auto pb-4 overflow-y-auto w-full relative">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Link to="/home" className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </Link>
          <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "28px", fontWeight: "700" }}>
            Designers
          </h1>
          <button className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <Filter size={24} className="text-[#2D2D2D]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4B5563]" size={20} />
          <input
            type="text"
            placeholder="Search by name, specialty, or location..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#FDFDFD] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent text-[#2D2D2D]"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2.5 rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${
                  activeFilter === filter.id
                    ? "bg-[#E76F51] text-white"
                    : "bg-[#FDFDFD] border border-gray-200 text-[#4B5563] hover:border-[#E76F51]/30"
                }`}
                style={{ fontWeight: "600", fontSize: "14px" }}
              >
                {Icon && <Icon size={16} />}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <p className="text-[#4B5563]">
            <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>{mockDesigners.length}</span> designers available
          </p>
          <button className="text-[#E76F51]" style={{ fontWeight: "600" }}>
            Sort by: Rating ↓
          </button>
        </div>
      </div>

      {/* Designer Cards */}
      <div className="px-6 pb-6 space-y-4">
        {mockDesigners.map((designer, index) => (
          <Link
            key={designer.id}
            to={`/designer/${designer.id}`}
            className="block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-[#E76F51]/30 hover:shadow-md transition-all"
          >
            {/* Designer Header */}
            <div className="p-5">
              <div className="flex gap-4 mb-4">
                {/* Designer Photo */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#E76F51] to-[#F4A261]">
                  <img
                    src={designerPhotos[index]}
                    alt={designer.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Designer Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#2D2D2D] mb-2" style={{ fontWeight: "700", fontSize: "18px" }}>
                    {designer.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-[#4B5563] flex-shrink-0" />
                    <span className="text-[#4B5563] text-sm truncate">{designer.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#F4A261]/10 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-[#F4A261] fill-[#F4A261]" />
                      <span className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                        {designer.rating}
                      </span>
                      <span className="text-[#4B5563] text-xs">({designer.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                {designer.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1.5 bg-[#FDFDFD] border border-gray-100 text-[#2D2D2D] text-xs rounded-xl whitespace-nowrap"
                    style={{ fontWeight: "600" }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[#4B5563] text-xs mb-0.5">Price Range</p>
                  <p className="text-[#E76F51] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                    {designer.priceRange}
                  </p>
                </div>
                <button className="px-5 py-2.5 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all">
                  <span style={{ fontWeight: "600" }}>View Profile</span>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      <div className="px-6 pb-6">
        <button className="w-full py-3.5 bg-white border border-gray-200 text-[#2D2D2D] rounded-2xl hover:border-[#E76F51]/30 hover:bg-[#FDFDFD] transition-all">
          <span style={{ fontWeight: "600" }}>Load More Designers</span>
        </button>
      </div>

      <BottomNav />
    </div>
    </div>
  );
}
