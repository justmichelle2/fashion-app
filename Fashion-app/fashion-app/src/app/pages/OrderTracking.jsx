import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, Loader, ArrowLeft } from "lucide-react";
import { auth } from "../firebaseConfig";
import { getUserOrders, getOrder } from "../utils/orderUtils";

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Confirmed" },
  in_progress: { bg: "bg-purple-100", text: "text-purple-800", label: "In Progress" },
  completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
};

const STATUS_STEPS = ["pending", "confirmed", "in_progress", "completed"];

export default function OrderTracking() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!auth.currentUser) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      const result = await getUserOrders();

      if (result.success) {
        setOrders(result.orders || []);
      } else {
        setError(result.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const getStatusProgress = (status) => {
    const index = STATUS_STEPS.indexOf(status);
    return index >= 0 ? ((index + 1) / STATUS_STEPS.length) * 100 : 0;
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-[#E76F51] mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!auth.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 mb-4">Please log in to view your orders</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#E76F51] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D55B3A] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#2D2D2D]">Order Tracking</h1>
            <p className="text-gray-600 text-sm mt-1">
              You have {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {["all", "pending", "confirmed", "in_progress", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition font-medium text-sm capitalize ${
                  filter === status
                    ? "bg-[#E76F51] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#E76F51]"
                }`}
              >
                {status === "in_progress" ? "In Progress" : status}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <Package className="text-gray-300 h-16 w-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-600">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-[#E76F51] font-semibold hover:underline"
              >
                View all orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              const isExpanded = selectedOrderId === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setSelectedOrderId(isExpanded ? null : order.orderId)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition flex items-start justify-between border-b"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2D2D2D]">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </p>

                      {/* Status Progress Bar */}
                      <div className="mt-4 mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#E76F51] h-2 rounded-full transition-all"
                            style={{ width: `${getStatusProgress(order.status)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Order Details Summary */}
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <p className="font-semibold text-[#2D2D2D]">
                            GHS {order.total?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Items:</span>
                          <p className="font-semibold text-[#2D2D2D]">
                            {order.items?.length || 0} item(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`ml-4 px-3 py-1 rounded-full flex-shrink-0 ${statusColor.bg}`}>
                      <span className={`font-semibold capitalize text-sm ${statusColor.text}`}>
                        {statusColor.label}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50 space-y-4 border-t">
                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-[#2D2D2D] mb-3">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-700">{item.name || "Item"}</span>
                                  <span className="font-semibold text-[#2D2D2D]">
                                    GHS {item.price?.toFixed(2) || "0.00"}
                                  </span>
                                </div>
                                {item.quantity && (
                                  <p className="text-gray-600 text-xs mt-1">
                                    Quantity: {item.quantity}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-[#2D2D2D] mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>GHS {order.subtotal?.toFixed(2) || "0.00"}</span>
                          </div>
                          {order.tax > 0 && (
                            <div className="flex justify-between text-gray-600">
                              <span>Tax:</span>
                              <span>GHS {order.tax?.toFixed(2) || "0.00"}</span>
                            </div>
                          )}
                          {order.shipping > 0 && (
                            <div className="flex justify-between text-gray-600">
                              <span>Shipping:</span>
                              <span>GHS {order.shipping?.toFixed(2) || "0.00"}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between font-semibold text-[#2D2D2D]">
                            <span>Total:</span>
                            <span>GHS {order.total?.toFixed(2) || "0.00"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-[#2D2D2D] mb-3">Payment Status</h4>
                        <div className={`px-3 py-2 rounded font-medium text-sm ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.paymentStatus === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : "Pending"}
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-[#2D2D2D] mb-3">Tracking Information</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Tracking Number:</span>
                              <p className="font-mono font-semibold text-[#2D2D2D]">
                                {order.trackingNumber}
                              </p>
                            </div>
                            {order.estimatedDelivery && (
                              <div>
                                <span className="text-gray-600">Estimated Delivery:</span>
                                <p className="font-semibold text-[#2D2D2D]">
                                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => navigate(`/payment?orderId=${order.orderId}`)}
                          className="flex-1 bg-[#E76F51] text-white py-3 rounded-lg font-semibold hover:bg-[#D55B3A] transition-colors"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

