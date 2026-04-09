import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, MessageCircle } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
];

export default function DesignerOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder({
            id: orderSnap.id,
            ...orderSnap.data()
          });
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
          <p className="text-[#2D3436]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-b border-gray-100 sticky top-0 px-6 py-4 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={20} className="text-[#2D2D2D]" />
            </button>
            <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
              Order Details
            </h1>
          </div>
          <div className="p-6 text-center">
            <p className="text-[#2D3436]">{error || "Order not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = order.createdAt?.toDate?.()?.toLocaleDateString() || new Date().toLocaleDateString();
  const deadline = order.deadlineDate?.toDate?.()?.toLocaleDateString() || "No deadline";
  const currentStatus = STATUS_OPTIONS.find(s => s.value === order.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 px-6 py-4 flex items-center gap-3 z-10">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} className="text-[#2D2D2D]" />
          </button>
          <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
            Order Details
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Order Info Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[#2D3436] text-sm mb-1">Customer</p>
                <p className="text-[#2D2D2D] font-semibold">{order.customerName || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[#2D3436] text-sm mb-1">Order ID</p>
                <p className="text-[#2D2D2D] font-semibold">{order.id.substring(0, 8)}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div>
                <p className="text-[#2D3436] text-sm mb-1">Title</p>
                <p className="text-[#2D2D2D] font-semibold">{order.title}</p>
              </div>
              <div>
                <p className="text-[#2D3436] text-sm mb-1">Description</p>
                <p className="text-[#2D2D2D]">{order.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#2D3436] text-sm mb-1">Garment Type</p>
                  <p className="text-[#2D2D2D] font-semibold capitalize">{order.garmentType || "Custom"}</p>
                </div>
                <div>
                  <p className="text-[#2D3436] text-sm mb-1">Budget</p>
                  <p className="text-[#E63946] font-semibold">GH₵{order.budget || order.price || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[#E63946] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-[#2D3436] text-sm">Order Placed</p>
                  <p className="text-[#2D2D2D] font-semibold">{createdDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-[#2D3436] text-sm">Deadline</p>
                  <p className="text-[#2D2D2D] font-semibold">{deadline}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Status
            </h3>
            <div className="mb-4">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${currentStatus?.color}`}>
                {currentStatus?.label}
              </div>
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status.value}
                  onClick={() => updateOrderStatus(status.value)}
                  disabled={updating || status.value === order.status}
                  className={`w-full p-3 rounded-2xl text-left transition-all ${
                    status.value === order.status
                      ? `${status.color} cursor-default`
                      : "bg-gray-50 hover:bg-gray-100 text-[#2D2D2D]"
                  } disabled:opacity-50`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specifications */}
          {order.specifications && Object.keys(order.specifications).length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
                Specifications
              </h3>
              <div className="space-y-3">
                {Object.entries(order.specifications).map(([key, value]) => (
                  value && (
                    <div key={key}>
                      <p className="text-[#2D3436] text-sm mb-1 capitalize">{key}</p>
                      <p className="text-[#2D2D2D] font-semibold">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Message Button */}
          <button
            onClick={() => navigate(`/chat/${order.customerId}`)}
            className="w-full py-3 bg-[#E63946] text-white rounded-2xl font-semibold hover:bg-[#C92A2A] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Message Customer
          </button>
        </div>
      </div>
    </div>
  );
}
