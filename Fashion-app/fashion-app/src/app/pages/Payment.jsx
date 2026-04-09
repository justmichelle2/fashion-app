import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CreditCard, Lock, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { auth } from "../firebaseConfig";
import { getOrder, recordPayment, updatePaymentStatus } from "../utils/orderUtils";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState("payment"); // payment, processing, success

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    method: "card" // card, momo, bank_transfer
  });

  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Fetch order details
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("No order specified");
        setLoading(false);
        return;
      }

      try {
        const result = await getOrder(orderId);
        if (result.success) {
          setOrder(result.order);
        } else {
          setError(result.error || "Order not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2").substring(0, 5);
    }

    // Limit CVV to 4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateCardData = () => {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Invalid card number (must be 16 digits)");
      return false;
    }
    if (!paymentData.cardName) {
      setError("Cardholder name is required");
      return false;
    }
    if (!paymentData.expiryDate || paymentData.expiryDate.length !== 5) {
      setError("Invalid expiry date (MM/YY)");
      return false;
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      setError("Invalid CVV (must be 3-4 digits)");
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateCardData()) {
      return;
    }

    setProcessing(true);
    setStep("processing");

    try {
      // Simulate payment processing (in production, use Stripe, PayPal, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Record payment
      const paymentResult = await recordPayment(orderId, {
        amount: order.total,
        method: paymentData.method,
        cardLast4: paymentData.cardNumber.slice(-4),
        reference: `PAY-${Date.now()}`,
        metadata: {
          cardName: paymentData.cardName,
          expiryDate: paymentData.expiryDate
        }
      });

      if (paymentResult.success) {
        setPaymentResult({
          success: true,
          transactionId: paymentResult.transactionId,
          amount: order.total,
          timestamp: new Date().toISOString()
        });
        setStep("success");
      } else {
        throw new Error(paymentResult.error);
      }
    } catch (err) {
      setError(err.message || "Payment processing failed. Please try again.");
      setStep("payment");
      
      // Update payment status to failed
      await updatePaymentStatus(orderId, "failed");
    } finally {
      setProcessing(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <Link to="/orders" className="text-[#E63946] font-semibold hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg">
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </button>
          <h1 className="text-3xl font-bold text-[#2D2D2D]">Payment</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Order #{order.orderId}</h2>
          
          <div className="space-y-3 text-sm mb-4">
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
            <div className="border-t pt-3 flex justify-between font-semibold text-[#2D2D2D]">
              <span>Total:</span>
              <span className="text-lg">GHS {order.total?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </div>

        {/* Payment Steps */}
        {step === "payment" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-[#2D2D2D] mb-6 flex items-center gap-2">
              <CreditCard size={24} className="text-[#E63946]" />
              Payment Method
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="text-red-700 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  disabled={processing}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] disabled:opacity-50"
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="John Doe"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  disabled={processing}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] disabled:opacity-50"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    disabled={processing}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    maxLength="4"
                    disabled={processing}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <Lock className="text-blue-700 flex-shrink-0" size={20} />
                <p className="text-blue-700 text-sm">
                  Your payment information is encrypted and secure
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-[#E63946] text-white py-4 rounded-lg font-semibold hover:bg-[#D55B3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? "Processing..." : `Pay GHS ${order.total?.toFixed(2) || "0.00"}`}
              </button>
            </form>
          </div>
        )}

        {/* Processing */}
        {step === "processing" && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#E63946] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#2D2D2D] font-semibold">Processing payment...</p>
            <p className="text-gray-600 text-sm mt-2">Please do not close this window</p>
          </div>
        )}

        {/* Success */}
        {step === "success" && paymentResult && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="mb-6">
              <CheckCircle size={64} className="text-green-500 mx-auto" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your order has been confirmed</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-[#2D2D2D]">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-[#E63946]">GHS {paymentResult.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="text-[#2D2D2D]">{new Date(paymentResult.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="w-full bg-[#E63946] text-white py-3 rounded-lg font-semibold hover:bg-[#D55B3A] transition-colors mb-3"
            >
              View Order
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full border border-[#E63946] text-[#E63946] py-3 rounded-lg font-semibold hover:bg-[#E63946]/5 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

