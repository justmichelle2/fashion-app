import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../utils/ordersService";
import { FaArrowLeft, FaCalendar, FaDollarSign, FaCheckCircle } from "react-icons/fa";

export default function BookTailoring() {
  const { designerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [step, setStep] = useState("details"); // details | review | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    description: "",
    notes: "",
    price: "",
    deadlineDate: "",
  });

  // Mock designer data - in production, fetch from Firestore
  const [designerInfo] = useState({
    name: "Designer " + (designerId?.slice(0, 4) || ""),
    specialization: "Custom Tailoring",
    averagePrice: 500,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError("Please describe what you want tailored");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    if (!formData.deadlineDate) {
      setError("Please select a deadline");
      return false;
    }

    // Check deadline is in the future
    const deadline = new Date(formData.deadlineDate);
    if (deadline < new Date()) {
      setError("Deadline must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const orderData = {
        customerId: currentUser.uid,
        designerId: designerId || "designer_01",
        designerName: designerInfo.name,
        description: formData.description,
        notes: formData.notes,
        price: parseFloat(formData.price),
        deadlineDate: new Date(formData.deadlineDate),
        measurements: {}, // Will be filled from UploadMeasurements
      };

      const result = await createOrder(orderData);

      if (result.success) {
        setOrderId(result.orderId);
        setStep("review");
      } else {
        setError("Failed to create order: " + result.error);
      }
    } catch (err) {
      setError("Error creating order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    navigate(`/payment?orderId=${orderId}`);
  };

  if (step === "details") {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Designer Info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <h1 className="text-3xl font-bold mb-2">{designerInfo.name}</h1>
              <p className="text-blue-100">{designerInfo.specialization}</p>
              <p className="text-blue-100 mt-2">
                Average Price: GHS {designerInfo.averagePrice}
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What do you want tailored? *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Describe the tailoring work in detail..."
                />
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaDollarSign /> Estimated Price (GHS) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter price"
                />
              </div>

              {/* Deadline */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendar /> Completion Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="deadlineDate"
                  value={formData.deadlineDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Additional Notes */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Any special requests or details..."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? "Creating Order..." : "Review Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-2xl" />
                <h1 className="text-3xl font-bold">Order Created!</h1>
              </div>
              <p className="text-green-100">Order ID: {orderId}</p>
            </div>

            {/* Order Summary */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8 pb-8 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Designer:</span>
                  <span className="font-semibold text-gray-800">{designerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Work Description:</span>
                  <span className="font-semibold text-gray-800 text-right max-w-xs">
                    {formData.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-800">GHS {parseFloat(formData.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(formData.deadlineDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Your order has been sent to the designer</li>
                  <li>✓ Designer will review and respond within 24 hours</li>
                  <li>✓ You'll receive a notification once accepted</li>
                  <li>✓ Complete payment to confirm the order</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  View All Orders
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

