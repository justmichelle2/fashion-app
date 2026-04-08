import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Package } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function DesignerOrders() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(
          ordersRef,
          where("designerId", "==", currentUser.uid)
        );
        const ordersSnap = await getDocs(ordersQuery);
        
        const orders = ordersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Separate orders by status
        const active = orders.filter(o => ["confirmed", "in_progress", "in-progress"].includes(o.status));
        const upcoming = orders.filter(o => o.status === "pending");
        const completed = orders.filter(o => ["completed", "delivered"].includes(o.status));

        setActiveOrders(active.map(o => ({
          id: o.id,
          customer: o.customerName || "Unknown Customer",
          item: o.title || "Order",
          status: o.status === "in_progress" || o.status === "in-progress" ? "In Progress" : "Confirmed",
          dueDate: o.deadlineDate?.toDate?.()?.toLocaleDateString() || "No deadline",
          amount: o.price || o.budget || 0,
          progress: o.status === "confirmed" ? 25 : o.status === "in_progress" || o.status === "in-progress" ? 60 : 100
        })));

        setUpcomingOrders(upcoming.map(o => ({
          id: o.id,
          customer: o.customerName || "Unknown Customer",
          item: o.title || "Order",
          orderDate: o.createdAt?.toDate?.()?.toLocaleDateString() || "Today",
          amount: o.price || o.budget || 0
        })));

        setCompletedOrders(completed.map(o => ({
          id: o.id,
          customer: o.customerName || "Unknown Customer",
          item: o.title || "Order",
          completedDate: o.updatedAt?.toDate?.()?.toLocaleDateString() || "Recently",
          amount: o.price || o.budget || 0,
          rating: 5 // Default rating, would need to fetch from reviews
        })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={20} className="text-[#2D2D2D]" />
          </button>
          <h1 className="text-[#2D2D2D] font-['Playfair_Display']" style={{ fontSize: "24px", fontWeight: "700" }}>
            Orders
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
        {/* Active Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Active Orders
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin">
                    <div className="w-6 h-6 border-3 border-gray-200 border-t-[#E76F51] rounded-full"></div>
                  </div>
                </div>
              ) : activeOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <Package size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-[#4B5563] text-sm">No active orders</p>
                </div>
              ) : (
                activeOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/designer/order/${order.id}`)}
                    className="w-full p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51] hover:bg-[#FFF9F6] transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[#2D2D2D] font-semibold">{order.customer}</p>
                        <p className="text-[#4B5563] text-sm">{order.item}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#E76F51] font-semibold">GH₵{order.amount}</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#4B5563]">Progress</span>
                        <span className="text-xs font-semibold text-[#E76F51]">{order.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Ready for Pickup"
                          ? "bg-[#10B981]/10 text-[#10B981] font-semibold"
                          : "bg-[#F4A261]/10 text-[#F4A261] font-semibold"
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-[#4B5563] flex items-center gap-1">
                        <Clock size={14} /> {order.dueDate}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Upcoming Orders
            </h2>
            <div className="space-y-3">
              {upcomingOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-[#4B5563] text-sm">No upcoming orders</p>
                </div>
              ) : (
                upcomingOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/designer/order/${order.id}`)}
                    className="w-full p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 flex items-center justify-between hover:border-[#E76F51] hover:bg-[#FFF9F6] transition-all text-left"
                  >
                    <div>
                      <p className="text-[#2D2D2D] font-semibold">{order.customer}</p>
                      <p className="text-[#4B5563] text-sm">{order.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#E76F51] font-semibold">GH₵{order.amount}</p>
                      <p className="text-[#4B5563] text-xs">{order.orderDate}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[#2D2D2D] mb-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Completed Orders
            </h2>
            <div className="space-y-3">
              {completedOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-[#4B5563] text-sm">No completed orders yet</p>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/designer/order/${order.id}`)}
                    className="w-full p-4 bg-[#FDFDFD] rounded-2xl border border-gray-50 hover:border-[#E76F51] hover:bg-[#FFF9F6] transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[#2D2D2D] font-semibold">{order.customer}</p>
                        <p className="text-[#4B5563] text-sm">{order.item}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#10B981] font-semibold flex items-center gap-1"><CheckCircle size={16} /> Completed</p>
                        <p className="text-[#4B5563] text-xs">{order.completedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#E76F51] font-semibold">GH₵{order.amount}</span>
                      <span className="text-[#10B981]">⭐ {order.rating}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
