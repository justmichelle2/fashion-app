import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { mockDesigners } from "../data/mockData";

export function BookTailoring() {
  const { designerId } = useParams();
  const navigate = useNavigate();
  const designer = mockDesigners.find(d => d.id === designerId) || mockDesigners[0];

  const [bookingData, setBookingData] = useState({
    style: "",
    date: "",
    time: "",
    notes: "",
  });

  const styles = [
    "Traditional Kente",
    "Ankara Dress",
    "Custom Suit",
    "Wedding Attire",
    "Casual Wear",
    "Formal Dress",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        designer: designer.name,
        style: bookingData.style,
        amount: 350,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to={`/designer/${designerId}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#111827]" />
          </Link>
          <h1 className="text-[#111827]" style={{ fontSize: "24px", fontWeight: "700" }}>
            Book Tailoring
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Designer Info */}
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
          <h3 className="text-[#111827] mb-1" style={{ fontWeight: "600", fontSize: "18px" }}>
            {designer.name}
          </h3>
          <p className="text-[#4B5563] text-sm">{designer.location}</p>
          <p className="text-[#006D5B] mt-2" style={{ fontWeight: "600" }}>
            {designer.priceRange}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Style Selection */}
          <div>
            <label className="block text-[#111827] mb-3" style={{ fontWeight: "600" }}>
              Select Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setBookingData({ ...bookingData, style })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all text-sm ${
                    bookingData.style === style
                      ? "bg-[#EAB308] text-white border-[#EAB308]"
                      : "bg-white text-[#111827] border-gray-200 hover:border-[#EAB308]"
                  }`}
                  style={{ fontWeight: "600" }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="date" className="block text-[#111827] mb-2" style={{ fontWeight: "600" }}>
              Preferred Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-[#111827] mb-3" style={{ fontWeight: "600" }}>
              Preferred Time
            </label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setBookingData({ ...bookingData, time })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    bookingData.time === time
                      ? "bg-[#EAB308] text-white border-[#EAB308]"
                      : "bg-white text-[#111827] border-gray-200 hover:border-[#EAB308]"
                  }`}
                  style={{ fontWeight: "600" }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-[#111827] mb-2" style={{ fontWeight: "600" }}>
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Any special requirements or design preferences..."
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-transparent resize-none"
            />
          </div>

          {/* Info Card */}
          <div className="p-4 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl">
            <p className="text-[#006D5B] text-sm">
              <strong>Note:</strong> The designer will confirm your booking within 24 hours. You'll be notified via SMS and in-app notification.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!bookingData.style || !bookingData.date || !bookingData.time}
            className="w-full py-3 bg-[#EAB308] text-white rounded-xl hover:bg-[#CA9A04] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ fontWeight: "600" }}
          >
            Proceed to Payment
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
