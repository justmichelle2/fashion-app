import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { auth } from "../firebaseConfig";
import { uploadCustomerMeasurements } from "../utils/customerUtils";

export default function UploadMeasurements() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    shoulder: "",
    sleeveLength: "",
    torsoLength: "",
    inseam: "",
    height: "",
    neck: "",
  });

  const [unit, setUnit] = useState("cm");
  const [notes, setNotes] = useState("");

  if (!auth.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to upload measurements</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D42F37]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate at least one measurement is provided
    if (Object.values(measurements).every((val) => val === "")) {
      setError("Please enter at least one measurement");
      return;
    }

    setLoading(true);

    try {
      const result = await uploadCustomerMeasurements({
        ...measurements,
        unit,
        notes,
      });

      if (result.success) {
        setSuccess("Measurements uploaded successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setError(result.error || "Failed to upload measurements");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const measurementFields = [
    { name: "chest", label: "Chest" },
    { name: "waist", label: "Waist" },
    { name: "hips", label: "Hips" },
    { name: "shoulder", label: "Shoulder" },
    { name: "sleeveLength", label: "Sleeve Length" },
    { name: "torsoLength", label: "Torso Length" },
    { name: "inseam", label: "Inseam" },
    { name: "height", label: "Height" },
    { name: "neck", label: "Neck" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#2D2D2D]">Upload Measurements</h1>
            <p className="text-gray-600 text-sm mt-1">Help designers create perfect fits</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-700 flex-shrink-0" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Unit Selection */}
            <div>
              <label className="text-sm font-semibold text-[#2D2D2D] mb-3 block">
                Measurement Unit
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="cm"
                    checked={unit === "cm"}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-[#2D2D2D]">Centimeters (cm)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="inches"
                    checked={unit === "inches"}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-[#2D2D2D]">Inches (in)</span>
                </label>
              </div>
            </div>

            {/* Measurements Grid */}
            <div>
              <label className="text-sm font-semibold text-[#2D2D2D] mb-4 block">
                Body Measurements
              </label>
              <div className="grid grid-cols-2 gap-4">
                {measurementFields.map((field) => (
                  <div key={field.name}>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      name={field.name}
                      value={measurements[field.name]}
                      onChange={handleInputChange}
                      placeholder="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Take measurements while wearing light clothing. For best results, have someone help you measure.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-semibold text-[#2D2D2D] mb-2 block">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special considerations or preferences..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#E63946] text-white py-4 rounded-lg font-semibold hover:bg-[#D42F37] transition disabled:opacity-50"
            >
              <Save size={20} /> {loading ? "Uploading..." : "Save Measurements"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
