import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDesignerOrdersMeasurements } from "../services/measurementsService";

export default function DesignerMeasurements() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getDesignerOrdersMeasurements(currentUser.uid);
        setMeasurements(data);
        console.log("Fetched measurements:", data);
      } catch (err) {
        console.error("Error fetching measurements:", err);
        setError("Failed to load measurements");
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [currentUser?.uid]);

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
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#E76F51]/30 border-t-[#E76F51] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#4B5563]">Loading measurements...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#E76F51] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D55B3A]"
              >
                Retry
              </button>
            </div>
          ) : measurements.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-4">
                <p className="text-blue-900 font-semibold mb-2">No measurements yet</p>
                <p className="text-blue-700 text-sm">Measurements will appear here when customers with active orders upload them</p>
                <ol className="text-blue-700 text-sm mt-4 space-y-1 text-left inline-block">
                  <li>1. Customer books you and creates an order</li>
                  <li>2. They upload their measurements & body images</li>
                  <li>3. You will see them here automatically</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {measurements.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[#2D2D2D] font-semibold">{m.customerName || m.customer || "Unknown"}</p>
                      <p className="text-[#4B5563] text-xs">
                        {m.date ? new Date(m.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "N/A"}
                      </p>
                      {m.orderStatus && (
                        <p className="text-[#E76F51] text-xs font-semibold mt-1 capitalize">{m.orderStatus}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition text-[#4B5563]">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setMeasurements(measurements.filter((item) => item.id !== m.id))}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-[#FDFDFD] rounded-xl text-center border border-gray-50">
                      <p className="text-[#E76F51] font-bold text-lg">{m.chest || m.bustSize || "—"}</p>
                      <p className="text-[#4B5563] text-xs">Chest {m.unit || "cm"}</p>
                    </div>
                    <div className="p-3 bg-[#FDFDFD] rounded-xl text-center border border-gray-50">
                      <p className="text-[#E76F51] font-bold text-lg">{m.waist || "—"}</p>
                      <p className="text-[#4B5563] text-xs">Waist {m.unit || "cm"}</p>
                    </div>
                    <div className="p-3 bg-[#FDFDFD] rounded-xl text-center border border-gray-50">
                      <p className="text-[#E76F51] font-bold text-lg">{m.hips || "—"}</p>
                      <p className="text-[#4B5563] text-xs">Hips {m.unit || "cm"}</p>
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
