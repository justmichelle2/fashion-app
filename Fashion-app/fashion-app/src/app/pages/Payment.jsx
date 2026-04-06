import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getOrderById, updateOrderStatus } from "../utils/ordersService";
import { processPayment, formatCardNumber, formatExpiryDate } from "../utils/paymentService";
import { FaCreditCard, FaLock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState("payment"); // payment | processing | success

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [paymentResult, setPaymentResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("No order specified");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await getOrderById(orderId);

      if (result.success) {
        setOrder(result.order);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Error fetching order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData((prev) => ({ ...prev, cardNumber: formatted }));
    setError("");
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData((prev) => ({ ...prev, expiryDate: formatted }));
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validatePaymentForm = () => {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Invalid card number");
      return false;
    }
    if (!paymentData.cardName.trim()) {
      setError("Cardholder name is required");
      return false;
    }
    if (!paymentData.expiryDate || !paymentData.expiryDate.includes("/")) {
      setError("Invalid expiry date (use MM/YY format)");
      return false;
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      setError("Invalid CVV");
      return false;
    }
    return true;
  };

  const handleProcessPayment = async () => {
    if (!validatePaymentForm()) return;

    try {
      setProcessing(true);
      setError("");
      setStep("processing");

      const result = await processPayment(
        {
          ...paymentData,
          amount: order.price,
        },
        orderId
      );

      if (result.success) {
        setPaymentResult(result);
        
        // Update order status to accepted after payment
        await updateOrderStatus(orderId, "accepted");
        
        setStep("success");
      } else {
        setError("Payment failed: " + (result.error || "Unknown error"));
        setStep("payment");
      }
    } catch (err) {
      setError("Payment error: " + err.message);
      setStep("payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <FaCheckCircle className="text-5xl" />
              </div>
              <h1 className="text-3xl font-bold text-center">Payment Successful!</h1>
              <p className="text-green-100 text-center mt-2">
                Payment ID: {paymentResult.paymentId}
              </p>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-green-900 mb-4">Order Confirmed</h2>
                <div className="space-y-2 text-sm text-green-800">
                  <p>✓ Your payment has been processed</p>
                  <p>✓ Order status updated to accepted</p>
                  <p>✓ Designer will begin work</p>
                  <p>✓ You'll receive updates via notifications</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Designer:</span>
                    <span className="font-semibold">{order.designerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-green-600">
                      GHS {order.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  View Order
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaCreditCard /> Payment Details
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {step === "processing" ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your payment...</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessPayment();
                }}
                className="space-y-4"
              >
                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                  <FaLock className="mt-0.5 flex-shrink-0" />
                  <p>Your payment information is secure and encrypted.</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {processing ? "Processing..." : "Complete Payment"}
                </button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-4 pb-6 border-b">
              <div>
                <span className="text-sm text-gray-600">Order ID</span>
                <p className="font-semibold text-gray-800">{orderId}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Designer</span>
                <p className="font-semibold text-gray-800">{order.designerName}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Work Description</span>
                <p className="text-gray-700 text-sm mt-1">{order.description}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Deadline</span>
                <p className="font-semibold text-gray-800">
                  {new Date(order.deadlineDate.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  GHS {order.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Fees</span>
                <span className="font-semibold text-gray-800">GHS 0.00</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  GHS {order.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

