import {
  processPayment as processPaymentMock,
  verifyPaymentStatus as verifyPaymentStatusMock,
} from "../utils/paymentService";
import { apiRequest, hasBackendApi } from "./apiClient";

export async function processPayment(paymentData, orderId) {
  if (!hasBackendApi()) {
    return processPaymentMock(paymentData, orderId);
  }

  try {
    const payload = await apiRequest("/payments/process", {
      method: "POST",
      body: JSON.stringify({ orderId, ...paymentData }),
    });
    return { success: true, ...payload };
  } catch (error) {
    return processPaymentMock(paymentData, orderId);
  }
}

export async function verifyPaymentStatus(paymentId) {
  if (!hasBackendApi()) {
    return verifyPaymentStatusMock(paymentId);
  }

  try {
    const payload = await apiRequest(`/payments/${paymentId}`);
    return { success: true, ...payload };
  } catch (error) {
    return verifyPaymentStatusMock(paymentId);
  }
}
