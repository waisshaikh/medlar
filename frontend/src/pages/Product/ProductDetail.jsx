import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { fetchProductDetail, fetchProducts } from "../../store/slices/productSlice.js";
import { addItem } from "../../store/slices/cartSlice.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import toast from "react-hot-toast";

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e0dbd4" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-4 text-sm font-medium text-[#1a1a1a] text-left tracking-wider uppercase"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-gray-600 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, list: related, loading } = useSelector((s) => s.products);
  const { token } = useSelector((s) => s.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetail(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchProducts({ category: product.category, limit: 4 }));
    }
    setSelectedImage(0);
    setSelectedVariant(null);
  }, [product, dispatch]);

  if (loading && !product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const variants = product.variants || [];
  const price = selectedVariant?.price?.amount || product.price?.amount || 0;
  const currency = product.price?.currency || "INR";
  const stock = selectedVariant?.stock ?? 99;

  const formatPrice = (p) => currency === "INR" ? `₹${p?.toLocaleString("en-IN")}` : `${currency} ${p}`;

  const handleAddToCart = async () => {
    if (!token) { toast.error("Please sign in"); navigate("/login"); return; }
    setAddingToCart(true);
    try {
      await dispatch(addItem({ productId: product._id, variantId: selectedVariant?._id || null, quantity })).unwrap();
      toast.success("Added to your bag!");
    } catch (err) {
      toast.error(err || "Failed to add");
    } finally {
      setAddingToCart(false);
    }
  };

  const relatedProducts = related.filter((p) => p._id !== product._id).slice(0, 4);

  return (
    <div className="pt-16 md:pt-20" style={{ backgroundColor: "#FAF7F2" }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 tracking-wider uppercase">
          <Link to="/" className="hover:text-[#E8272A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#E8272A] transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/collections/${product.category.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-[#E8272A] transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#1a1a1a]">{product.tittle}</span>
        </div>
      </div>

      {/* Main Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Images */}
          <div>
            {/* Main image */}
            <div
              className="rounded-sm overflow-hidden mb-3 flex items-center justify-center p-6"
              style={{ backgroundColor: "#fff", aspectRatio: "1", border: "1px solid #e0dbd4" }}
            >
              {images[selectedImage]?.url ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[selectedImage].url}
                  alt={product.tittle}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ShoppingBag size={80} className="text-gray-200" />
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-sm overflow-hidden flex items-center justify-center p-1 transition-all ${selectedImage === i ? "border-2 border-[#E8272A]" : "border border-[#e0dbd4] hover:border-[#999]"}`}
                    style={{ backgroundColor: "#FAF7F2" }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div>
            {/* SKU */}
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-2">
              SKU: {product._id?.slice(-8).toUpperCase() || "MEDLAR"}
            </p>

            {/* Name */}
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.tittle}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= 4 ? "#C9A84C" : "none"} stroke={s <= 4 ? "#C9A84C" : "#ccc"} />
                ))}
              </div>
              <span className="text-xs text-gray-500">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {formatPrice(price)}
              </span>
              <p className="text-[10px] text-gray-500 mt-1 tracking-wider">Inclusive of all taxes</p>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#1a1a1a] mb-3">
                  {Object.keys(variants[0]?.attributes || {})[0] || "Variant"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v === selectedVariant ? null : v)}
                      className={`px-4 py-2 text-xs tracking-wider border rounded-sm transition-all ${
                        selectedVariant?._id === v._id
                          ? "bg-[#111] text-white border-[#111]"
                          : "text-[#1a1a1a] border-[#ddd] hover:border-[#111]"
                      }`}
                    >
                      {Object.values(v.attributes || {}).join(" / ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#1a1a1a]">Qty</span>
              <div className="flex items-center border border-[#ddd] rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#E8272A] transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#E8272A] transition-colors"
                >
                  +
                </button>
              </div>
              {stock < 10 && stock > 0 && (
                <span className="text-xs text-orange-500">Only {stock} left</span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || stock === 0}
                className="flex-1 py-4 text-white text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: "#111111" }}
              >
                {addingToCart ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    {stock === 0 ? "OUT OF STOCK" : "ADD TO BAG"}
                  </>
                )}
              </button>
              <button
                className="w-14 h-14 flex items-center justify-center border border-[#ddd] hover:border-[#E8272A] text-gray-400 hover:text-[#E8272A] transition-all rounded-sm"
                onClick={() => toast.success("Added to wishlist")}
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Stock status */}
            <p className="text-xs text-green-600 font-medium mb-6">
              {stock > 0 ? `✓ In stock · Ships in 21 hours` : "Out of stock"}
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: <Truck size={16} />, label: "Free Shipping", sub: "On all orders" },
                { icon: <RotateCcw size={16} />, label: "15-Day Returns", sub: "Hassle-free" },
                { icon: <Shield size={16} />, label: "2-Year Warranty", sub: "On all bags" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center text-center p-3 rounded-sm"
                  style={{ backgroundColor: "#fff", border: "1px solid #e0dbd4" }}
                >
                  <span className="text-[#E8272A] mb-1">{b.icon}</span>
                  <p className="text-[9px] font-medium tracking-wider uppercase text-[#1a1a1a]">{b.label}</p>
                  <p className="text-[9px] text-gray-400">{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Description & Accordion */}
            <div style={{ borderTop: "1px solid #e0dbd4" }}>
              <AccordionItem title="Description">
                <p>{product.description || "No description available."}</p>
              </AccordionItem>
              <AccordionItem title="Specifications">
                <ul className="space-y-1">
                  <li>Category: {product.category}</li>
                  <li>Price: {formatPrice(price)}</li>
                  {variants.length > 0 && <li>Available variants: {variants.length}</li>}
                </ul>
              </AccordionItem>
              <AccordionItem title="Key Features">
                <ul className="space-y-1 list-disc list-inside">
                  <li>Premium quality materials</li>
                  <li>Ergonomic design for comfort</li>
                  <li>Durable zippers and hardware</li>
                  <li>Water-resistant exterior</li>
                  <li>Dedicated laptop/device compartment</li>
                </ul>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2
                className="text-2xl font-bold text-[#1a1a1a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                You may also like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
