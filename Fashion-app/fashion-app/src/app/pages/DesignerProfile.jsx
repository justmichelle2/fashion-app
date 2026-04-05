import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Award, MessageCircle, ArrowLeft, Heart } from "lucide-react";
import { mockDesigners } from "../data/mockData";
import { useState } from "react";

export default function DesignerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const designer = mockDesigners.find((d) => d.id === id);
  const [liked, setLiked] = useState(false);

  if (!designer)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#6B6B6B]">Designer not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-br from-[#E76F51] to-[#F4A261]">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/2 px-6">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] flex items-center justify-center text-5xl border-4 border-white shadow-lg">
            👨‍🎨
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-6 pb-20">
        {/* Info */}
        <div className="text-center mb-8">
          <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] mb-2">{designer.name}</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#6B6B6B]" />
            <span className="text-[#6B6B6B] font-['Raleway']">{designer.location}</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="px-4 py-2 bg-[#F5E6D3] rounded-full">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#E76F51]" />
                <span className="text-[#2D2D2D] font-semibold text-sm">{designer.rating}</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-[#E76F51]/10 rounded-full">
              <span className="text-[#E76F51] font-semibold text-sm">{designer.priceRange}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h2 className="text-[#2D2D2D] font-bold font-['Playfair_Display'] mb-3">About</h2>
          <p className="text-[#6B6B6B] font-['Raleway'] leading-relaxed">{designer.bio}</p>
        </div>

        {/* Specialties */}
        <div className="mb-8">
          <h2 className="text-[#2D2D2D] font-bold font-['Playfair_Display'] mb-3">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {designer.specialties.map((spec) => (
              <span key={spec} className="px-4 py-2 bg-[#E76F51]/10 text-[#E76F51] rounded-full text-sm font-['Raleway']">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-[#2D2D2D] font-bold font-['Playfair_Display'] mb-3">Experience</h2>
          <div className="space-y-4">
            <div className="flex gap-3 bg-white rounded-xl p-4">
              <Award className="w-6 h-6 text-[#E76F51] flex-shrink-0" />
              <div>
                <h3 className="text-[#2D2D2D] font-semibold font-['Raleway']">Years of Experience</h3>
                <p className="text-[#6B6B6B] text-sm font-['Raleway']">8+ years crafting bespoke designs</p>
              </div>
            </div>
            <div className="flex gap-3 bg-white rounded-xl p-4">
              <Award className="w-6 h-6 text-[#E76F51] flex-shrink-0" />
              <div>
                <h3 className="text-[#2D2D2D] font-semibold font-['Raleway']">Satisfied Customers</h3>
                <p className="text-[#6B6B6B] text-sm font-['Raleway']">500+ happy clients across Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E76F51]/10 flex gap-3">
        <button
          onClick={() => navigate(`/chat/${designer.id}`)}
          className="flex-1 h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold flex items-center justify-center gap-2 transition"
        >
          <MessageCircle className="w-5 h-5" />
          Message
        </button>

        <button
          onClick={() => setLiked(!liked)}
          className={`w-14 h-14 rounded-full border-2 hover:border-[#E76F51] transition ${
            liked ? "bg-red-50 border-red-500" : "border-[#E76F51]/20 bg-white"
          }`}
        >
          <Heart className={`w-6 h-6 mx-auto ${liked ? "fill-red-500 text-red-500" : "text-[#6B6B6B]"}`} />
        </button>
      </div>
    </div>
  );
}

