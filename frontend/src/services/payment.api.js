import api from "./api.js";
export const createPendingPayment = (data) => api.post("/payment/create", data);
export const verifyPayment = (data) => api.post("/payment/verify", data);
export const getUserPayments = () => api.get("/payment/");
export const getSellerOrders = () => api.get("/payment/seller/orders");
export const updateOrderStatus = (data) => api.patch("/payment/seller/orders/status", data);
