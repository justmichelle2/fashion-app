import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Filter, Search, TrendingUp, Award, Clock, ChevronDown, X } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useState, useEffect } from "react";
import { 
  getAllDesigners, 
  searchDesigners, 
  getAvailableSpecialties,
  getTopRatedDesigners,
  getDesignersBySpecialty 
} from "../services/designerService";

export default function DesignerList() {
  // State Management
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter State
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [activeFilter, setActiveFilter] = useState("all");

  // Default designer photos for UI
  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1726142916875-814508f61e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1620511450270-47162b983078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  ];

  // Load specialties on mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const specs = await getAvailableSpecialties();
        setSpecialties(specs);
      } catch (err) {
        console.error("Error loading specialties:", err);
      }
    };
    loadSpecialties();
  }, []);

  // Load designers based on filters and search
  useEffect(() => {
    const loadDesigners = async () => {
      setLoading(true);
      try {
        let results = [];

        // Handle different active filter types
        if (activeFilter === "top") {
          results = await getTopRatedDesigners(20);
        } else if (activeFilter === "nearby") {
          // For now, just get all - in production, would use geolocation
          const data = await getAllDesigners({ pageLimit: 20 });
          results = data.designers;
        } else if (activeFilter === "available") {
          // In production, would filter by availability
          const data = await getAllDesigners({ pageLimit: 20 });
          results = data.designers;
        } else if (searchTerm || selectedSpecialty || minPrice > 0 || maxPrice < 500 || minRating > 0) {
          // Use advanced search if any filters are set
          results = await searchDesigners({
            keyword: searchTerm,
            specialty: selectedSpecialty || undefined,
            minPrice: minPrice,
            maxPrice: maxPrice,
            minRating: minRating,
            sortBy: sortBy
          });
        } else {
          // Load all designers
          const data = await getAllDesigners({ sortBy, pageLimit: 20 });
          results = data.designers;
        }

        console.log("[DesignerList] Loaded designers:", results.length, results);
        setDesigners(results);
      } catch (err) {
        console.error("Error loading designers:", err);
        setDesigners([]);
      } finally {
        setLoading(false);
      }
    };

    loadDesigners();
  }, [searchTerm, selectedSpecialty, minPrice, maxPrice, minRating, sortBy, activeFilter]);

  const filters = [
    { id: "all", label: "All Designers", icon: null },
    { id: "top", label: "Top Rated", icon: Award },
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "available", label: "Available", icon: Clock },
  ];

  // Handle filter reset
  const resetFilters = () => {
    setSelectedSpecialty("");
    setMinPrice(0);
    setMaxPrice(500);
    setMinRating(0);
    setSearchTerm("");
    setSortBy("rating");
    setActiveFilter("all");
  };

  const hasActiveFilters = searchTerm || selectedSpecialty || minPrice > 0 || maxPrice < 500 || minRating > 0;

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
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-all relative"
          >
            <Filter size={24} className="text-[#2D2D2D]" />
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E76F51] rounded-full"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4B5563]" size={20} />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#FDFDFD] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent text-[#2D2D2D]"
          />
        </div>
      </div>

      {/* Advanced Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#2D2D2D] text-lg" style={{ fontWeight: "700" }}>
                Filter Designers
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-[#2D2D2D]" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Specialty Filter */}
              <div>
                <label className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                  Price Range ($) - ${minPrice} to ${maxPrice}
                </label>
                <div className="mt-3 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                >
                  <option value="0">Any Rating</option>
                  <option value="4">4.0+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.8">4.8+ ⭐</option>
                </select>
              </div>

              {/* Sort Option */}
              <div>
                <label className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                >
                  <option value="rating">Rating</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="experience">Experience</option>
                  <option value="price">Price (Low to High)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 border border-gray-200 text-[#2D2D2D] rounded-xl hover:bg-gray-50 transition-all"
                  style={{ fontWeight: "600" }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all"
                  style={{ fontWeight: "600" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>
              {loading ? "..." : designers.length}
            </span> designers found
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#E76F51] hover:text-[#D35F41] transition-all"
              style={{ fontWeight: "600", fontSize: "13px" }}
            >
              Clear Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Designer Cards */}
      <div className="px-6 pb-6 space-y-4">
        {loading ? (
          // Loading State
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E76F51] rounded-full"></div>
            </div>
          </div>
        ) : designers.length === 0 ? (
          // Empty State
          <div className="py-12 text-center">
            <div className="text-[#4B5563] mb-4">
              <Filter size={40} className="mx-auto mb-4 opacity-50" />
              <p style={{ fontWeight: "600" }}>No designers found</p>
              <p className="text-sm mt-2 opacity-75">Try adjusting your filters or search terms</p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D35F41] transition-all"
                style={{ fontWeight: "600" }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          designers.map((designer, index) => (
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
                      src={designer.profilePicture || designerPhotos[index % designerPhotos.length]}
                      alt={designer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = designerPhotos[index % designerPhotos.length];
                      }}
                    />
                  </div>

                  {/* Designer Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#2D2D2D] mb-2" style={{ fontWeight: "700", fontSize: "18px" }}>
                      {designer.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-[#4B5563] flex-shrink-0" />
                      <span className="text-[#4B5563] text-sm truncate">
                        {designer.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-[#F4A261]/10 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-[#F4A261] fill-[#F4A261]" />
                        <span className="text-[#2D2D2D] text-sm" style={{ fontWeight: "600" }}>
                          {(designer.rating || 5).toFixed(1)}
                        </span>
                        <span className="text-[#4B5563] text-xs">
                          ({designer.reviewCount || designer.reviews || 0})
                        </span>
                      </div>
                      {designer.verified && (
                        <Award size={14} className="text-[#E76F51]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                {designer.specialties && designer.specialties.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                    {(Array.isArray(designer.specialties) ? designer.specialties : [designer.specialties]).slice(0, 3).map((specialty, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-[#FDFDFD] border border-gray-100 text-[#2D2D2D] text-xs rounded-xl whitespace-nowrap"
                        style={{ fontWeight: "600" }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[#4B5563] text-xs mb-0.5">Hourly Rate</p>
                    <p className="text-[#E76F51] font-['Playfair_Display']" style={{ fontWeight: "700", fontSize: "16px" }}>
                      ${designer.hourlyRate || designer.priceRange || "50-100"}
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-[#E76F51] text-white rounded-xl hover:bg-[#D35F41] transition-all">
                    <span style={{ fontWeight: "600" }}>View Profile</span>
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && designers.length > 0 && (
        <div className="px-6 pb-6">
          <button className="w-full py-3.5 bg-white border border-gray-200 text-[#2D2D2D] rounded-2xl hover:border-[#E76F51]/30 hover:bg-[#FDFDFD] transition-all">
            <span style={{ fontWeight: "600" }}>Load More Designers</span>
          </button>
        </div>
      )}

      <BottomNav />
    </div>
    </div>
  );
}
