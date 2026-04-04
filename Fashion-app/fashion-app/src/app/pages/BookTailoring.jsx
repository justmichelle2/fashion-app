import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";

export default function BookTailoring() {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hip: "",
    sleeve: "",
    length: "",
  });
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(measurements).every((v) => v.trim())) {
      setSubmitted(true);
      setTimeout(() => navigate("/orders"), 2000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] text-center mb-2">Booking Confirmed!</h1>
        <p className="text-[#6B6B6B] text-center font-['Raleway']">Your tailoring appointment has been scheduled.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-[#F5E6D3] flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-[#2D2D2D]" />
        </button>
        <div>
          <h1 className="text-[#2D2D2D] text-xl font-bold font-['Playfair_Display']">Book Tailoring</h1>
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Schedule your custom fitting</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Measurements Section */}
          <div className="bg-white rounded-2xl p-6 border border-[#E76F51]/10">
            <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Your Measurements (in cm)</h2>

            <div className="space-y-4">
              {[
                { label: "Chest", name: "chest", placeholder: "Enter chest measurement" },
                { label: "Waist", name: "waist", placeholder: "Enter waist measurement" },
                { label: "Hip", name: "hip", placeholder: "Enter hip measurement" },
                { label: "Sleeve Length", name: "sleeve", placeholder: "Enter sleeve length" },
                { label: "Total Length", name: "length", placeholder: "Enter total length" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[#2D2D2D] font-semibold font-['Raleway'] mb-2">{field.label}</label>
                  <input
                    type="number"
                    name={field.name}
                    value={measurements[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-2xl p-6 border border-[#E76F51]/10">
            <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or design preferences?"
              className="w-full bg-[#F5E6D3]/30 text-[#2D2D2D] placeholder-[#6B6B6B]/60 rounded-xl p-4 border border-[#E76F51]/20 focus:border-[#E76F51] focus:outline-none resize-none h-32"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold text-lg shadow-lg transition"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
