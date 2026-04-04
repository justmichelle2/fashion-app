import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function UploadMeasurements() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => navigate("/home"), 1500);
  };

  if (uploaded) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] text-center mb-2">Measurements Uploaded!</h1>
        <p className="text-[#6B6B6B] text-center font-['Raleway']">Designers can now see your preferences.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-[#2D2D2D] text-3xl font-bold font-['Playfair_Display'] mb-3">Upload Measurements</h1>
        <p className="text-[#6B6B6B] font-['Raleway'] text-lg">Help designers understand your size better</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl border-2 border-dashed border-[#E76F51] p-8 mb-8 text-center">
        <div className="w-16 h-16 bg-[#E76F51]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-[#E76F51]" />
        </div>

        <h3 className="text-[#2D2D2D] font-bold text-lg font-['Raleway'] mb-2">Drag or click to upload</h3>
        <p className="text-[#6B6B6B] text-sm font-['Raleway'] mb-4">Photo or document showing your measurements</p>

        <button
          type="button"
          className="w-full px-6 py-3 bg-[#E76F51] text-white rounded-full font-semibold font-['Raleway'] hover:bg-[#D55B3A] transition"
        >
          Choose File
        </button>
      </div>

      <button
        onClick={handleUpload}
        className="w-full max-w-sm h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold text-lg shadow-lg transition"
      >
        Upload & Continue
      </button>
    </div>
  );
}
