import { Link, useParams } from "react-router";
import { ArrowLeft, MapPin, Star, MessageCircle, Heart } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mockDesigners } from "../data/mockData";

export function DesignerProfile() {
  const { id } = useParams();
  const designer = mockDesigners.find(d => d.id === id) || mockDesigners[0];

  const designerPhotos = [
    "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI2MDU2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwbWFuJTIwdGFpbG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNjI0MTk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const portfolioImages = [
    "https://images.unsplash.com/photo-1733324961705-97bd6cd7f4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFzaGlvbiUyMGRlc2lnbiUyMHBvcnRmb2xpb3xlbnwxfHx8fDE3NzI2MjQyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1763823132521-72f373850de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEFmcmljYW4lMjBjbG90aGluZyUyMHN0eWxlfGVufDF8fHx8MTc3MjYyNDIyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1760907949889-eb62b7fd9f75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBZnJpY2FuJTIwZHJlc3MlMjBkZXNpZ258ZW58MXx8fHwxNzcyNjI0MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1661332517932-2d441bfb2994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd2VkZGluZyUyMGF0dGlyZXxlbnwxfHx8fDE3NzI2MjQyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1710559056465-6a71e5089342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFzaGlvbiUyMGtlbnRlJTIwZHJlc3N8ZW58MXx8fHwxNzcyNjI0MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1621945094361-aed061046504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0YWlsb3JlZCUyMHN1aXQlMjBHaGFuYXxlbnwxfHx8fDE3NzI2MjQxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const reviews = [
    { id: 1, name: "Kwame A.", rating: 5, comment: "Excellent work! Very professional and timely.", date: "2 weeks ago" },
    { id: 2, name: "Ama K.", rating: 5, comment: "Beautiful designs. Highly recommend!", date: "1 month ago" },
    { id: 3, name: "Kofi M.", rating: 4, comment: "Great quality, would use again.", date: "2 months ago" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      {/* Header with Photo */}
      <div className="relative">
        <div className="h-72 bg-gradient-to-br from-[#E76F51] to-[#F4A261]">
          <ImageWithFallback
            src={designerPhotos[parseInt(id || "0") % 2]}
            alt={designer.name}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        {/* Back Button */}
        <Link
          to="/designers"
          className="absolute top-6 left-6 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-[#111827]" />
        </Link>

        {/* Favorite Button */}
        <button className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors">
          <Heart size={24} className="text-[#EF4444]" />
        </button>

        {/* Designer Info Card */}
        <div className="absolute -bottom-16 left-6 right-6 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-[#111827] mb-2" style={{ fontSize: "24px", fontWeight: "700" }}>
            {designer.name}
          </h1>
          
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#4B5563]" />
            <span className="text-[#4B5563]">{designer.location}</span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-[#F4A261] fill-[#F4A261]" />
              <span className="text-[#111827]" style={{ fontWeight: "700", fontSize: "18px" }}>
                {designer.rating}
              </span>
              <span className="text-[#4B5563]">({designer.reviews} reviews)</span>
            </div>
          </div>

          <div className="flex gap-2">
            {designer.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-[#E76F51]/10 text-[#E76F51] text-sm rounded-full"
                style={{ fontWeight: "600" }}
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-20 px-6 py-6 space-y-8">
        {/* About */}
        <div>
          <h2 className="text-[#111827] mb-3" style={{ fontSize: "20px", fontWeight: "700" }}>
            About
          </h2>
          <p className="text-[#4B5563] leading-relaxed">{designer.bio}</p>
          <div className="mt-3">
            <span className="text-[#2D2D2D]" style={{ fontWeight: "600" }}>
              Price Range: {designer.priceRange}
            </span>
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <h2 className="text-[#111827] mb-4" style={{ fontSize: "20px", fontWeight: "700" }}>
            Portfolio
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {portfolioImages.map((image, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-[#111827] mb-4" style={{ fontSize: "20px", fontWeight: "700" }}>
            Reviews ({designer.reviews})
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#111827]" style={{ fontWeight: "600" }}>
                    {review.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-[#F4A261] fill-[#F4A261]" />
                    ))}
                  </div>
                </div>
                <p className="text-[#4B5563] text-sm mb-2">{review.comment}</p>
                <span className="text-[#4B5563] text-xs">{review.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <Link
            to={`/chat/${id}`}
            className="flex-shrink-0 p-3 bg-white border-2 border-[#2D2D2D] rounded-xl hover:bg-[#2D2D2D]/5 transition-colors"
          >
            <MessageCircle size={24} className="text-[#2D2D2D]" />
          </Link>
          <Link
            to={`/book/${id}`}
            className="flex-1 py-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#D55B3A] transition-colors text-center"
            style={{ fontWeight: "600" }}
          >
            Book Now
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}