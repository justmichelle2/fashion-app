/**
 * Payment Processing Service
 * Handles payment processing with Stripe
 */

/**
 * VALIDATE PAYMENT DETAILS
 * Validates card details before processing
 */
export const validatePaymentDetails = (paymentData) => {
  const errors = {};

  if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
    errors.cardNumber = "Invalid card number (16 digits required)";
  }

  if (!paymentData.cardName || paymentData.cardName.trim() === "") {
    errors.cardName = "Cardholder name is required";
  }

  if (!paymentData.expiryDate || !paymentData.expiryDate.includes("/")) {
    errors.expiryDate = "Invalid expiry date (MM/YY format required)";
  }

  if (!paymentData.cvv || paymentData.cvv.length < 3) {
    errors.cvv = "Invalid CVV (3-4 digits required)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * PROCESS PAYMENT (Mock Implementation)
 * In production, this would call your backend API which communicates with Stripe
 * NEVER handle card details directly on frontend in production!
 */
export const processPayment = async (paymentData, orderId) => {
  try {
    // Validate input
    const validation = validatePaymentDetails(paymentData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // In production, send to your backend API endpoint:
    // const response = await fetch('/api/process-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     orderId,
    //     amount: paymentData.amount,
    //     // Backend will handle card details securely
    //   })
    // });

    // Mock successful payment for demo
    console.log("Processing payment for order:", orderId);
    console.log("Amount:", paymentData.amount);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return mock success (in reality, Stripe confirmation would come from backend)
    return {
      success: true,
      paymentId: `py_${Math.random().toString(36).substr(2, 9)}`,
      message: "Payment successful",
      orderId,
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * VERIFY PAYMENT STATUS
 * Checks if a payment was successful
 */
export const verifyPaymentStatus = async (paymentId) => {
  try {
    // In production, call your backend to verify with Stripe
    // const response = await fetch(`/api/verify-payment/${paymentId}`);
    // const data = await response.json();
    // return data;

    // Mock verification
    return {
      success: true,
      status: "succeeded",
      paymentId,
      amount: 0,
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * REFUND PAYMENT
 * Process a refund for a completed payment
 */
export const refundPayment = async (paymentId, reason) => {
  try {
    // In production, call your backend refund endpoint
    // const response = await fetch('/api/refund-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentId, reason })
    // });

    console.log("Processing refund for payment:", paymentId);

    return {
      success: true,
      refundId: `rf_${Math.random().toString(36).substr(2, 9)}`,
      message: "Refund processed successfully",
    };
  } catch (error) {
    console.error("Refund processing error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * FORMAT CARD NUMBER
 * Formats card number with spaces for display
 */
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

/**
 * FORMAT EXPIRY DATE
 * Formats expiry date MM/YY
 */
export const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length >= 2) {
    return v.slice(0, 2) + "/" + v.slice(2, 4);
  }
  return v;
};
