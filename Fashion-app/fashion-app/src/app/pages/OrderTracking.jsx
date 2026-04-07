import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getCustomerOrders } from "../services/ordersApi";
import { FaBox, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import BottomNav from "../components/BottomNav";

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: FaClock },
  accepted: { bg: "bg-[#E76F51]/10", text: "text-[#E76F51]", icon: FaCheckCircle },
  tailoring: { bg: "bg-[#F4A261]/10", text: "text-[#F4A261]", icon: FaSpinner },
  completed: { bg: "bg-green-100", text: "text-green-800", icon: FaCheckCircle },
  cancelled: { bg: "bg-red-100", text: "text-red-800", icon: FaTimesCircle },
};

const STATUS_STEPS = ["pending", "accepted", "tailoring", "completed"];

export default function OrderTracking() {
  const { currentUser, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchOrders();
    }
  }, [currentUser, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCustomerOrders(currentUser.uid);

      if (result.success) {
        setOrders(result.orders);
      } else {
        setError(result.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Error fetching orders: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const getStatusProgress = (status) => {
    return (STATUS_STEPS.indexOf(status) + 1) / STATUS_STEPS.length * 100;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E76F51] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Tracking</h1>
          <p className="text-gray-600">
            You have {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {["all", "pending", "accepted", "tailoring", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition capitalize ${
                  filter === status
                    ? "bg-[#E76F51] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#E76F51]"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FaBox className="text-4xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-600">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = STATUS_COLORS[order.status]?.icon || FaBox;
              const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.pending;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Designer: {order.designerName}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg}`}>
                        <StatusIcon className={statusColor.text} />
                        <span className={`font-semibold capitalize ${statusColor.text}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Status Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#E76F51] h-2 rounded-full transition-all"
                          style={{ width: `${getStatusProgress(order.status)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Order Details Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-semibold text-gray-800">GHS {order.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Deadline:</span>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.deadlineDate.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="p-6 bg-gray-50 space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Work Description</h4>
                        <p className="text-gray-700">{order.description}</p>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Additional Notes</h4>
                          <p className="text-gray-700">{order.notes}</p>
                        </div>
                      )}

                      {/* Created Date */}
                      <div>
                        <span className="text-gray-600">Order Date:</span>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.createdAt.seconds * 1000).toLocaleString()}
                        </p>
                      </div>

                      {/* Review (if completed) */}
                      {order.status === "completed" && order.review && (
                        <div className="bg-white p-4 rounded border-l-4 border-green-500">
                          <h4 className="font-semibold text-gray-800 mb-2">Review</h4>
                          <p className="text-yellow-500 mb-2">★ {order.review.rating}/5</p>
                          <p className="text-gray-700">{order.review.comment}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {order.status !== "cancelled" && order.status !== "completed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // In production, show review/cancel dialog
                          }}
                          className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                        >
                          View More Options
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

