import { useSelector, useDispatch } from "react-redux";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { closeCart, removeItem, updateItem } from "../../store/slices/cartSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, items, totalPrice, currency } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);

  const handleRemove = (itemId) => {
    if (!token) { toast.error("Please sign in"); return; }
    dispatch(removeItem(itemId));
  };

  const handleUpdate = (itemId, qty) => {
    if (qty < 1) return;
    dispatch(updateItem({ itemId, quantity: qty }));
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    if (!token) { navigate("/login"); return; }
    navigate("/checkout");
  };

  const formatPrice = (price) => {
    if (currency === "INR") return `₹${price?.toLocaleString("en-IN") || 0}`;
    return `${currency} ${price || 0}`;
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => dispatch(closeCart())}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ backgroundColor: "#FAF7F2" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ backgroundColor: "#111", borderBottom: "1px solid #333" }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-white" />
                <span className="text-white text-sm tracking-[0.15em] uppercase font-medium">
                  Your Bag ({items.length})
                </span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <ShoppingBag size={48} className="text-gray-300" />
                  <p className="text-gray-500 text-sm tracking-wide">Your bag is empty</p>
                  <button
                    onClick={() => { dispatch(closeCart()); navigate("/shop"); }}
                    className="text-xs tracking-widest uppercase text-white px-6 py-3 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#E8272A" }}
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 rounded-sm"
                    style={{ backgroundColor: "#fff", border: "1px solid #eee" }}
                  >
                    {/* Image */}
                    <div
                      className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden flex items-center justify-center p-2"
                      style={{ backgroundColor: "#FAF7F2" }}
                    >
                      {item.product?.images?.[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product?.tittle}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-300" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1a1a1a] truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.product?.tittle || "Product"}
                      </p>
                      {item.variant && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {Object.entries(item.variant.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(", ")}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#E8272A] mt-1">
                        {formatPrice(item.price?.amount || item.product?.price?.amount)}
                      </p>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-sm">
                          <button
                            onClick={() => handleUpdate(item._id, (item.quantity || 1) - 1)}
                            className="px-2 py-1 text-gray-500 hover:text-[#E8272A] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleUpdate(item._id, (item.quantity || 1) + 1)}
                            className="px-2 py-1 text-gray-500 hover:text-[#E8272A] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-gray-400 hover:text-[#E8272A] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-5 space-y-3"
                style={{ borderTop: "1px solid #e0dbd4" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 tracking-wider uppercase">Subtotal</span>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 tracking-wider uppercase">Shipping</span>
                  <span className="text-xs font-medium text-green-600">FREE</span>
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #e0dbd4" }}>
                  <span className="text-xs font-medium tracking-wider uppercase">Total</span>
                  <span className="text-base font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 text-white text-xs tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#E8272A" }}
                >
                  CHECKOUT
                </button>
                <button
                  onClick={() => { dispatch(closeCart()); navigate("/cart"); }}
                  className="w-full py-3 text-[#1a1a1a] text-xs tracking-[0.15em] uppercase border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
                >
                  VIEW CART
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
