import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home/Home.jsx";
import Shop from "../pages/Shop/Shop.jsx";
import ProductDetail from "../pages/Product/ProductDetail.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import CustomerDashboard from "../pages/Customer/Dashboard.jsx";
import SellerDashboard from "../pages/Seller/SellerDashboard.jsx";
import AddProduct from "../pages/Seller/AddProduct.jsx";
import SellerOrders from "../pages/Seller/SellerOrders.jsx";

function ProtectedRoute({ children, role }) {
  const { user, token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/collections/:category" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/seller" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/orders" element={<ProtectedRoute role="seller"><SellerOrders /></ProtectedRoute>} />
      <Route path="/seller/add-product" element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
    </Routes>
  );
}
