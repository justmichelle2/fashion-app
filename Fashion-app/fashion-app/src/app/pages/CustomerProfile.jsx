import { useNavigate } from "react-router-dom";
import { Edit, User, Phone, MapPin, LogOut, ArrowRight, Heart, ClipboardList } from "lucide-react";
import { useState } from "react";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profile] = useState({
    name: "Sarah Mensah",
    email: "sarah@example.com",
    phone: "+233 50 123 4567",
    location: "Accra, Ghana",
    bio: "Fashion enthusiast and entrepreneur",
    orders: 5,
    favorites: 12,
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-[#E76F51] to-[#F4A261]">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition"
        >
          <Edit className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/2 px-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] flex items-center justify-center text-3xl border-4 border-white shadow-lg">
            👩
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-6">
        {/* Profile Info */}
        <div className="text-center mb-10">
          <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display']">{profile.name}</h1>
          <p className="text-[#6B6B6B] font-['Raleway'] mt-1">{profile.bio}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-8">
          <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10">
            <Phone className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
            <div>
              <p className="text-[#6B6B6B] text-xs font-['Raleway']">Phone</p>
              <p className="text-[#2D2D2D] font-semibold font-['Raleway']">{profile.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10">
            <User className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
            <div>
              <p className="text-[#6B6B6B] text-xs font-['Raleway']">Email</p>
              <p className="text-[#2D2D2D] font-semibold font-['Raleway']">{profile.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-[#E76F51]/10">
            <MapPin className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
            <div>
              <p className="text-[#6B6B6B] text-xs font-['Raleway']">Location</p>
              <p className="text-[#2D2D2D] font-semibold font-['Raleway']">{profile.location}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            onClick={() => navigate("/orders")}
            className="bg-white rounded-xl p-5 text-center border border-[#E76F51]/10 hover:shadow-md transition cursor-pointer"
          >
            <ClipboardList className="w-6 h-6 text-[#E76F51] mx-auto mb-3" />
            <p className="text-[#2D2D2D] text-2xl font-bold">{profile.orders}</p>
            <p className="text-[#6B6B6B] text-xs font-['Raleway']">Orders</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center border border-[#E76F51]/10">
            <Heart className="w-6 h-6 text-[#E76F51] mx-auto mb-3" />
            <p className="text-[#2D2D2D] text-2xl font-bold">{profile.favorites}</p>
            <p className="text-[#6B6B6B] text-xs font-['Raleway']">Favorites</p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-2 mb-8">
          <button className="w-full bg-white rounded-xl p-4 flex items-center justify-between border border-[#E76F51]/10 hover:border-[#E76F51]/30 transition text-left">
            <span className="text-[#2D2D2D] font-semibold font-['Raleway']">My Measurements</span>
            <ArrowRight className="w-5 h-5 text-[#6B6B6B]" />
          </button>

          <button className="w-full bg-white rounded-xl p-4 flex items-center justify-between border border-[#E76F51]/10 hover:border-[#E76F51]/30 transition text-left">
            <span className="text-[#2D2D2D] font-semibold font-['Raleway']">Payment Methods</span>
            <ArrowRight className="w-5 h-5 text-[#6B6B6B]" />
          </button>

          <button className="w-full bg-white rounded-xl p-4 flex items-center justify-between border border-[#E76F51]/10 hover:border-[#E76F51]/30 transition text-left">
            <span className="text-[#2D2D2D] font-semibold font-['Raleway']">Settings</span>
            <ArrowRight className="w-5 h-5 text-[#6B6B6B]" />
          </button>

          <button className="w-full bg-red-50 rounded-xl p-4 flex items-center justify-between border border-red-200 hover:border-red-300 transition text-left">
            <span className="text-red-600 font-semibold font-['Raleway']">Logout</span>
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
