import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";

export default function DesignerMeasurements() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);

    // Real-time listener for orders assigned to this designer
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(ordersRef, where("designerId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(ordersQuery, async (ordersSnapshot) => {
      try {
        const measurementsArray = [];
        const processedCustomers = new Set();

        // Process each order
        for (const orderDoc of ordersSnapshot.docs) {
          const order = orderDoc.data();
          const customerId = order.customerId;

          // Skip if already processed
          if (processedCustomers.has(customerId)) {
            continue;
          }
          processedCustomers.add(customerId);

          try {
            // Fetch measurements for this customer
            const measurementsRef = collection(db, "customerMeasurements");
            const measurementsQuery = query(measurementsRef, where("customerId", "==", customerId));
            
            const measurementsSnapshot = await getDocs(measurementsQuery);
            
            if (!measurementsSnapshot.empty) {
              const measurementDoc = measurementsSnapshot.docs[0];
              const docData = measurementDoc.data();

              measurementsArray.push({
                id: measurementDoc.id,
                orderId: orderDoc.id,
                customerName: order.customerName || "Unknown",
                customerEmail: order.customerEmail || "",
                orderStatus: order.status || "pending",
                customerId: customerId,
                chest: docData.measurements?.chest || docData.chest || 0,
                waist: docData.measurements?.waist || docData.waist || 0,
                hips: docData.measurements?.hips || docData.hips || 0,
                shoulder: docData.measurements?.shoulder || docData.shoulder || 0,
                unit: docData.unit || "cm",
                date: docData.createdAt?.toDate?.() || new Date(),
              });
            }
          } catch (err) {
            console.warn(`Could not fetch measurements for order ${orderDoc.id}:`, err);
          }
        }

        setMeasurements(measurementsArray);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error processing measurements:", err);
        setError("Failed to load measurements");
        setLoading(false);
      }
    }, (err) => {
      console.error("Error listening to orders:", err);
      setError("Failed to load measurements");
      setLoading(false);
    });

    return () => unsubscribe();
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
          <button className="p-2 hover:bg-gray-100 rounded-lg transition bg-[#E63946]/10 text-[#E63946]">
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
          <div className="mt-8 bg-[#E63946]/5 rounded-2xl p-6 border border-[#E63946]/20">
            <h3 className="text-[#2D2D2D] font-semibold mb-3">Measurement Guide</h3>
            <ul className="space-y-2 text-sm text-[#2D3436]">
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
