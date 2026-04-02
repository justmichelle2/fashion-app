import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { ArrowLeft, CreditCard, Smartphone, Lock } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { DrssedLogo } from "../components/DrssedLogo";

export function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { designer, style, amount } = location.state || {
    designer: "Akosua Mensah",
    style: "Traditional Kente",
    amount: 350,
  };

  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "momo">("paystack");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    setTimeout(() => {
      alert("Payment successful! Your order has been placed.");
      navigate("/orders");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/home" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#111827]" />
          </Link>
          <h1 className="text-[#111827]" style={{ fontSize: "24px", fontWeight: "700" }}>
            Payment
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Order Summary */}
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-2xl">
          <h2 className="text-[#111827] mb-4" style={{ fontSize: "20px", fontWeight: "700" }}>
            Order Summary
          </h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Designer</span>
              <span className="text-[#111827]" style={{ fontWeight: "600" }}>
                {designer}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4B5563]">Style</span>
              <span className="text-[#111827]" style={{ fontWeight: "600" }}>
                {style}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-[#111827]" style={{ fontSize: "18px", fontWeight: "700" }}>
                Total Amount
              </span>
              <span className="text-[#E76F51]" style={{ fontSize: "24px", fontWeight: "700" }}>
                GH₵ {amount}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-[#111827] mb-3" style={{ fontWeight: "600" }}>
              Select Payment Method
            </label>
            
            <div className="space-y-3">
              {/* Paystack */}
              <button
                type="button"
                onClick={() => setPaymentMethod("paystack")}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === "paystack"
                    ? "border-[#E76F51] bg-[#E76F51]/5"
                    : "border-gray-200 bg-white hover:border-[#E76F51]"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === "paystack" ? "bg-[#E76F51]" : "bg-gray-100"
                }`}>
                  <CreditCard size={24} className={paymentMethod === "paystack" ? "text-white" : "text-gray-600"} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[#111827]" style={{ fontWeight: "600" }}>
                    Card Payment
                  </h3>
                  <p className="text-[#4B5563] text-sm">Pay securely with Paystack</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === "paystack"
                    ? "border-[#E76F51] bg-[#E76F51]"
                    : "border-gray-300"
                }`}>
                  {paymentMethod === "paystack" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>

              {/* Mobile Money */}
              <button
                type="button"
                onClick={() => setPaymentMethod("momo")}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === "momo"
                    ? "border-[#E76F51] bg-[#E76F51]/5"
                    : "border-gray-200 bg-white hover:border-[#E76F51]"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  paymentMethod === "momo" ? "bg-[#E76F51]" : "bg-gray-100"
                }`}>
                  <Smartphone size={24} className={paymentMethod === "momo" ? "text-white" : "text-gray-600"} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[#111827]" style={{ fontWeight: "600" }}>
                    Mobile Money
                  </h3>
                  <p className="text-[#4B5563] text-sm">MTN MoMo, Vodafone Cash, AirtelTigo</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === "momo"
                    ? "border-[#E76F51] bg-[#E76F51]"
                    : "border-gray-300"
                }`}>
                  {paymentMethod === "momo" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "momo" && (
            <div>
              <label htmlFor="phone" className="block text-[#111827] mb-2" style={{ fontWeight: "600" }}>
                Mobile Money Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+233 XX XXX XXXX"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-3 p-4 bg-[#2D2D2D]/10 border border-[#2D2D2D]/20 rounded-xl">
            <Lock size={20} className="text-[#2D2D2D]" />
            <p className="text-[#2D2D2D] text-sm">
              Secure payment powered by {paymentMethod === "paystack" ? "Paystack" : "MTN MoMo"}
            </p>
          </div>

          {/* drssed Logo Badge */}
          <div className="flex items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
            <DrssedLogo size={40} />
            <div className="text-left">
              <p className="text-[#111827]" style={{ fontWeight: "600" }}>
                drssed
              </p>
              <p className="text-[#4B5563] text-sm">Trusted custom fashion platform</p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#D55B3A] transition-colors"
            style={{ fontWeight: "600" }}
          >
            Confirm Payment - GH₵ {amount}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
