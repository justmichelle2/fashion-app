import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, Camera } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export function UploadMeasurements() {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    shoulder: "",
    wrist: "",
    height: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle measurement submission
    alert("Measurements saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/home" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#111827]" />
          </Link>
          <h1 className="text-[#111827]" style={{ fontSize: "24px", fontWeight: "700" }}>
            Upload Measurements
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Info Card */}
        <div className="mb-6 p-4 bg-[#006D5B]/10 border border-[#006D5B]/20 rounded-xl">
          <p className="text-[#006D5B] text-sm">
            Accurate measurements ensure the perfect fit. You can also upload photos for reference.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unit Toggle */}
          <div>
            <label className="block text-[#111827] mb-3" style={{ fontWeight: "600" }}>
              Measurement Unit
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUnit("inches")}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  unit === "inches"
                    ? "bg-[#EAB308] text-white border-[#EAB308]"
                    : "bg-white text-[#111827] border-gray-200"
                }`}
                style={{ fontWeight: "600" }}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  unit === "cm"
                    ? "bg-[#EAB308] text-white border-[#EAB308]"
                    : "bg-white text-[#111827] border-gray-200"
                }`}
                style={{ fontWeight: "600" }}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Measurement Inputs */}
          <div className="space-y-4">
            {Object.entries(measurements).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-[#111827] mb-2 capitalize">
                  {key}
                </label>
                <div className="relative">
                  <input
                    id={key}
                    type="number"
                    step="0.1"
                    placeholder={`Enter ${key} in ${unit}`}
                    value={value}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, [key]: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-[#111827] mb-3" style={{ fontWeight: "600" }}>
              Reference Photos (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#EAB308] hover:bg-[#EAB308]/5 transition-all"
              >
                <Camera size={32} className="text-gray-400" />
                <span className="text-[#4B5563] text-sm">Take Photo</span>
              </button>
              <button
                type="button"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#EAB308] hover:bg-[#EAB308]/5 transition-all"
              >
                <Upload size={32} className="text-gray-400" />
                <span className="text-[#4B5563] text-sm">Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Measurement Guide */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <h3 className="text-[#111827] mb-2" style={{ fontWeight: "600" }}>
              Measurement Guide
            </h3>
            <ul className="space-y-2 text-[#4B5563] text-sm">
              <li>• <strong>Chest:</strong> Measure around the fullest part</li>
              <li>• <strong>Waist:</strong> Measure around natural waistline</li>
              <li>• <strong>Hips:</strong> Measure around the fullest part</li>
              <li>• <strong>Shoulder:</strong> Measure across back from shoulder to shoulder</li>
              <li>• <strong>Wrist:</strong> Measure around wrist bone</li>
              <li>• <strong>Height:</strong> Measure from top of head to floor</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#EAB308] text-white rounded-xl hover:bg-[#CA9A04] transition-colors"
            style={{ fontWeight: "600" }}
          >
            Save Measurements
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
