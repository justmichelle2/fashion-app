import { useState } from "react";
import { CreditCard, Wallet, DollarSign, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const amount = 850;

  const handlePayment = async () => {
    setProcessing(true);
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => navigate("/orders"), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-[#2D2D2D] text-2xl font-bold font-['Playfair_Display'] text-center mb-2">Payment Successful!</h1>
        <p className="text-[#6B6B6B] text-center font-['Raleway']">Your order has been placed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm p-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-[#F5E6D3] flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-[#2D2D2D]" />
        </button>
        <div>
          <h1 className="text-[#2D2D2D] text-xl font-bold font-['Playfair_Display']">Payment</h1>
          <p className="text-[#6B6B6B] text-xs font-['Raleway']">Complete your order</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E76F51]/10">
          <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4 pb-4 border-b border-[#E76F51]/10">
            <div className="flex justify-between items-center">
              <p className="text-[#6B6B6B] font-['Raleway']">Custom Wedding Dress</p>
              <p className="text-[#2D2D2D] font-semibold font-['Raleway']">₵750</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[#6B6B6B] font-['Raleway']">Alterations</p>
              <p className="text-[#2D2D2D] font-semibold font-['Raleway']">₵100</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[#2D2D2D] font-bold font-['Playfair_Display']">Total</p>
            <p className="text-[#E76F51] text-2xl font-bold font-['Raleway']">₵{amount}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 mb-6">
        <h2 className="text-[#2D2D2D] font-bold text-lg font-['Playfair_Display'] mb-4">Payment Method</h2>

        <div className="space-y-3">
          {[
            { id: "card", label: "Credit/Debit Card", icon: <CreditCard className="w-6 h-6" /> },
            { id: "wallet", label: "Mobile Wallet", icon: <Wallet className="w-6 h-6" /> },
            { id: "bank", label: "Bank Transfer", icon: <DollarSign className="w-6 h-6" /> },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full rounded-xl p-4 flex items-center gap-4 border-2 transition ${
                paymentMethod === method.id
                  ? "border-[#E76F51] bg-[#E76F51]/5"
                  : "border-[#E76F51]/20 bg-white hover:border-[#E76F51]"
              }`}
            >
              <div className={`${paymentMethod === method.id ? "text-[#E76F51]" : "text-[#6B6B6B]"}`}>{method.icon}</div>
              <span className="text-[#2D2D2D] font-semibold font-['Raleway']">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6">
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full h-14 bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#D55B3A] hover:to-[#DB9149] text-white rounded-full font-['Raleway'] font-semibold text-lg shadow-lg transition disabled:opacity-60"
        >
          {processing ? "Processing..." : `Pay ₵${amount}`}
        </button>
      </div>
    </div>
  );
}
