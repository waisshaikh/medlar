import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { addItem } from "../../store/slices/cartSlice.js";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const name = product.tittle || product.title || "Unnamed Product";
  const category = product.category || "";
  const price = product.price?.amount || 0;
  const currency = product.price?.currency || "INR";
  const image = product.images?.[0]?.url || null;
  const isNew = product.isNew;
  const isBestseller = product.isBestseller;
  const rating = product.averageRating || 4.5;
  const reviews = product.reviewCount || 0;

  const formatPrice = (p) => {
    if (currency === "INR") return `₹${p?.toLocaleString("en-IN")}`;
    return `${currency} ${p}`;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please sign in to add to cart");
      navigate("/login");
      return;
    }
    try {
      await dispatch(addItem({ productId: product._id, variantId: null, quantity: 1 })).unwrap();
      toast.success(`${name} added to bag`);
    } catch (err) {
      toast.error(err || "Failed to add to cart");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer relative rounded-sm overflow-hidden"
      style={{ backgroundColor: "#FAF7F2" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Badge */}
      {(isBestseller || isNew) && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[9px] tracking-[0.15em] uppercase font-medium px-2 py-1 rounded-sm"
            style={{
              backgroundColor: isBestseller ? "#C9A84C" : "#E8272A",
              color: "#fff",
            }}
          >
            {isBestseller ? "BESTSELLER" : "NEW"}
          </span>
        </div>
      )}

      {/* Wishlist */}
      <button
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#E8272A]"
        onClick={(e) => { e.stopPropagation(); toast.success("Added to wishlist"); }}
      >
        <Heart size={16} />
      </button>

      {/* Image */}
      <div className="bg-[#FAF7F2] p-6 flex items-center justify-center h-56 overflow-hidden">
        {image ? (
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ShoppingBag size={48} />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4" style={{ backgroundColor: "#fff" }}>
        <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase mb-1">{category}</p>
        <h3
          className="text-sm font-medium text-[#1a1a1a] mb-1 truncate"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={10}
              fill={s <= Math.round(rating) ? "#C9A84C" : "none"}
              stroke={s <= Math.round(rating) ? "#C9A84C" : "#ccc"}
            />
          ))}
          {reviews > 0 && <span className="text-[9px] text-gray-400 ml-1">({reviews})</span>}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1a1a1a]">{formatPrice(price)}</span>
          <motion.button
            onClick={handleAddToCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="text-[9px] tracking-[0.12em] uppercase text-white px-3 py-1.5 rounded-sm hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#E8272A" }}
          >
            ADD
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
