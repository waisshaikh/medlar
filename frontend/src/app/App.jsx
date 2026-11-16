import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "../store/slices/authSlice.js";
import AppRoutes from "./App.route.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import CartDrawer from "../components/CartDrawer/CartDrawer.jsx";
import { useLocation } from "react-router-dom";
import "./App.css";

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isSellerPage = location.pathname.startsWith("/seller");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(fetchMe());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {!isAuthPage && <Navbar />}
      <CartDrawer />
      <AppRoutes />
      {!isAuthPage && !isSellerPage && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#1a1a1a", color: "#fff", fontFamily: "'Inter', sans-serif" } }}
      />
    </div>
  );
}

import { BrowserRouter } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
