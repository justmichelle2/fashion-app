import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DesignerMeasurements() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [measurements, setMeasurements] = useState([
    {
      id: "1",
      customer: "Akosua Owusu",
      date: "2024-04-01",
      chest: 90,
      waist: 75,
      hips: 95,
      unit: "cm",
    },
    {
      id: "2",
      customer: "Ama Boateng",
      date: "2024-04-02",
      chest: 95,
      waist: 80,
      hips: 100,
      unit: "cm",
    },
    {
      id: "3",
      customer: "Efua Mensah",
      date: "2024-04-03",
      chest: 88,
      waist: 72,
      hips: 92,
      unit: "cm",
    },
  ]);

  const handleDelete = (id) => {
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={20} className="text-[#2D2D2D]" />
            </button>
            <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
              Measurements
            </h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition bg-[#E76F51]/10 text-[#E76F51]">
            <Plus size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {measurements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4B5563] mb-4">No measurements recorded yet</p>
              <button className="bg-[#E76F51] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D55B3A]">
                Add Measurement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {measurements.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[#2D2D2D] font-semibold">{m.customer}</p>
                      <p className="text-[#4B5563] text-xs">
                        {new Date(m.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition text-[#4B5563]">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-[#FDFDFD] rounded-xl text-center border border-gray-50">
                      <p className="text-[#E76F51] font-bold text-lg">{m.chest}</p>
                      <p className="text-[#4B5563] text-xs">Chest {m.unit}</p>
                    </div>
                    <div className="p-3 bg-[#FDFDFD] rounded-xl text-center border border-gray-50">
                      <p className="text-[#E76F51] font-bold text-lg">{m.waist}</p>
                      <p className="text-[#4B5563] text-xs">Waist {m.unit}</p>
                    </div>
                    <div className="p-3 bg-[#FDFDFD] rounded-xl text-center border border-gray-50">
                      <p className="text-[#E76F51] font-bold text-lg">{m.hips}</p>
                      <p className="text-[#4B5563] text-xs">Hips {m.unit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Measurement Reference */}
          <div className="mt-8 bg-[#E76F51]/5 rounded-2xl p-6 border border-[#E76F51]/20">
            <h3 className="text-[#2D2D2D] font-semibold mb-3">Measurement Guide</h3>
            <ul className="space-y-2 text-sm text-[#4B5563]">
              <li>• <strong>Chest:</strong> Measure across the fullest part of the chest</li>
              <li>• <strong>Waist:</strong> Measure at the natural waistline</li>
              <li>• <strong>Hips:</strong> Measure at the fullest part of the hips</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
