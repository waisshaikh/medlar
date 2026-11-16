import api from "./api.js";
export const getAllProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/product/${id}`);
export const getSellerProducts = () => api.get("/products/seller");
export const createProduct = (formData) =>
  api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProduct = (id, formData) =>
  api.put(`/products/seller/product/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteProduct = (id) => api.delete(`/products/seller/product/${id}`);
export const addVariant = (productId, formData) =>
  api.post(`/products/seller/product/${productId}/variants`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateVariantStock = (productId, variantId, stock) =>
  api.patch(`/products/seller/product/${productId}/variants/${variantId}/stock`, { stock });
export const deleteVariant = (productId, variantId) =>
  api.delete(`/products/seller/product/${productId}/variants/${variantId}`);
