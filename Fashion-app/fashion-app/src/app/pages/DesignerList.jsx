import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, MessageCircle, Heart } from "lucide-react";
import { mockDesigners } from "../data/mockData";

export default function DesignerList() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6">
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display']">Top Designers</h1>
        <p className="text-[#6B6B6B] text-sm font-['Raleway']">Curated collection of Ghana's best</p>
      </div>

      <div className="p-6 space-y-3">
        {mockDesigners.map((designer) => (
          <div key={designer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-[#E76F51]/10">
            {/* Designer Card Header - Clickable */}
            <button
              onClick={() => navigate(`/designer/${designer.id}`)}
              className="p-4 w-full text-left"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#E76F51] to-[#F4A261] flex-shrink-0 flex items-center justify-center text-2xl">
                  👨‍🎨
                </div>

                <div className="flex-1">
                  <h3 className="text-[#2D2D2D] font-bold text-lg font-['Raleway']">{designer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-[#6B6B6B]" />
                    <span className="text-[#6B6B6B] text-xs font-['Raleway']">{designer.location}</span>
                    <div className="flex items-center gap-1 ml-auto bg-[#F5E6D3] px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-[#E76F51]" />
                      <span className="text-[#2D2D2D] text-xs font-semibold">{designer.rating}</span>
                    </div>
                  </div>
                  <p className="text-[#6B6B6B] text-xs font-['Raleway'] mt-2 line-clamp-2">{designer.bio}</p>
                </div>
              </div>
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2 p-4 pt-0 border-t border-[#E76F51]/10">
              <button
                onClick={() => navigate(`/chat/${designer.id}`)}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-lg font-['Raleway'] font-semibold text-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>

              <button
                onClick={() => toggleLike(designer.id)}
                className={`flex-1 h-10 rounded-lg border-2 transition font-['Raleway'] font-semibold text-sm ${
                  liked[designer.id]
                    ? "bg-red-50 border-red-500 text-red-600"
                    : "border-[#E76F51]/20 text-[#6B6B6B] hover:border-[#E76F51]"
                }`}
              >
                <Heart className={`w-4 h-4 mx-auto ${liked[designer.id] ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

