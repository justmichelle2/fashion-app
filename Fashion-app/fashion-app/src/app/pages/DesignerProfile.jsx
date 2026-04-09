import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, MessageCircle, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function DesignerProfile() {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDesigner = async () => {
      try {
        const designerRef = doc(db, "users", id);
        const designerSnap = await getDoc(designerRef);
        
        if (!designerSnap.exists()) {
          setError("Designer not found");
          setLoading(false);
          return;
        }

        const data = designerSnap.data();
        setDesigner({
          id: id,
          name: data.name || data.businessName || "Designer",
          businessName: data.businessName || "",
          location: data.location || "",
          rating: data.rating || 4.5,
          reviews: data.reviews || 0,
          bio: data.bio || "Professional tailor and designer",
          specialties: data.specialties || ["Custom Tailoring"],
          priceRange: data.priceRange || "GHS 100 - 500",
          profilePicture: data.profilePicture || data.avatar || "",
          portfolioImages: data.portfolioImages || []
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching designer:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchDesigner();
    }
  }, [id]);

  const designerPhotos = designer?.profilePicture 
    ? [designer.profilePicture] 
    : [
        "https://images.unsplash.com/photo-1668752741330-8adc5cef7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        "https://images.unsplash.com/photo-1765910083971-aa0e3688be46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      ];

  const portfolioImages = designer?.portfolioImages && designer.portfolioImages.length > 0
    ? designer.portfolioImages
    : [
        "https://images.unsplash.com/photo-1733324961705-97bd6cd7f4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        "https://images.unsplash.com/photo-1763823132521-72f373850de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        "https://images.unsplash.com/photo-1760907949889-eb62b7fd9f75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        "https://images.unsplash.com/photo-1661332517932-2d441bfb2994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        "https://images.unsplash.com/photo-1710559056465-6a71e5089342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        "https://images.unsplash.com/photo-1621945094361-aed061046504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden h-[90vh] sm:h-auto pb-4 overflow-y-auto w-full relative">
      
      {loading && (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <p className="text-[#2D3436]">Loading designer profile...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center p-6">
            <p className="text-[#EF4444]">{error}</p>
            <Link to="/designers" className="text-[#E63946] mt-4 inline-block hover:underline">
              Back to Designers
            </Link>
          </div>
        </div>
      )}

      {designer && (
        <>
      {/* Header with Photo */}
      <div className="relative">
        <div className="h-72 bg-gradient-to-br from-[#E63946] to-[#D4AF37]">
          <img
            src={designerPhotos[0]}
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
            <MapPin size={16} className="text-[#2D3436]" />
            <span className="text-[#2D3436]">{designer.location}</span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-[#111827]" style={{ fontWeight: "700", fontSize: "18px" }}>
                {designer.rating}
              </span>
              <span className="text-[#2D3436]">({designer.reviews} reviews)</span>
            </div>
          </div>

          <div className="flex gap-2">
            {designer.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-[#E63946]/10 text-[#E63946] text-sm rounded-full"
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
          <p className="text-[#2D3436] leading-relaxed">{designer.bio}</p>
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
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
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
            className="flex-1 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#D55B3A] transition-colors text-center"
            style={{ fontWeight: "600" }}
          >
            Book Now
          </Link>
        </div>
      </div>
        </>
      )}

    </div>
    </div>
  );
}