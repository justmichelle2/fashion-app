import {
  createOrder as createOrderInFirestore,
  getOrderById as getOrderByIdInFirestore,
  getCustomerOrders as getCustomerOrdersInFirestore,
  getDesignerOrders as getDesignerOrdersInFirestore,
  updateOrderStatus as updateOrderStatusInFirestore,
} from "../utils/ordersService";
import { apiRequest, hasBackendApi } from "./apiClient";

export async function createOrder(orderData) {
  if (!hasBackendApi()) {
    return createOrderInFirestore(orderData);
  }

  try {
    const payload = await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return { success: true, ...payload };
  } catch (error) {
    return createOrderInFirestore(orderData);
  }
}

export async function getOrderById(orderId) {
  if (!hasBackendApi()) {
    return getOrderByIdInFirestore(orderId);
  }

  try {
    const payload = await apiRequest(`/orders/${orderId}`);
    return { success: true, ...payload };
  } catch (error) {
    return getOrderByIdInFirestore(orderId);
  }
}

export async function getCustomerOrders(customerId) {
  if (!hasBackendApi()) {
    return getCustomerOrdersInFirestore(customerId);
  }

  try {
    const payload = await apiRequest(`/orders?customerId=${encodeURIComponent(customerId)}`);
    return { success: true, ...payload };
  } catch (error) {
    return getCustomerOrdersInFirestore(customerId);
  }
}

export async function getDesignerOrders(designerId) {
  if (!hasBackendApi()) {
    return getDesignerOrdersInFirestore(designerId);
  }

  try {
    const payload = await apiRequest(`/orders?designerId=${encodeURIComponent(designerId)}`);
    return { success: true, ...payload };
  } catch (error) {
    return getDesignerOrdersInFirestore(designerId);
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  if (!hasBackendApi()) {
    return updateOrderStatusInFirestore(orderId, newStatus);
  }

  try {
    const payload = await apiRequest(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    return { success: true, ...payload };
  } catch (error) {
    return updateOrderStatusInFirestore(orderId, newStatus);
  }
}
