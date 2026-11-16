import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { fetchProducts } from "../../store/slices/productSlice.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

const CATEGORY_LABELS = {
  "backpacks": "Backpacks",
  "laptop-bags": "Laptop Bags",
  "messenger-bags": "Messenger Bags",
  "sling-bags": "Sling Bags",
  "duffel-bags": "Duffel Bags",
  "travel-bags": "Travel Bags",
  "leather-bags": "Leather Bags",
};

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

const ALL_CATEGORIES = ["backpacks", "laptop-bags", "messenger-bags", "sling-bags", "duffel-bags", "travel-bags", "leather-bags"];

export default function Shop() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: products, loading } = useSelector((s) => s.products);
  const [sort, setSort] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  const categoryLabel = category ? CATEGORY_LABELS[category] || category : "All Bags";
  const apiCategory = category ? CATEGORY_LABELS[category] || category : undefined;

  useEffect(() => {
    dispatch(fetchProducts({ category: apiCategory, sort }));
  }, [dispatch, apiCategory, sort]);

  return (
    <div className="pt-16 md:pt-20 min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      {/* Hero Header */}
      <div
        className="relative py-16 md:py-24 overflow-hidden"
        style={{ backgroundColor: "#111" }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] text-[#E8272A] tracking-[0.4em] uppercase">
              {category ? "Collection" : "Shop All"}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {categoryLabel}
            </h1>
            <p className="text-gray-400 text-sm mt-3">
              Premium travel gear, engineered for the journey.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        className="sticky top-16 md:top-20 z-30 overflow-x-auto"
        style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0dbd4" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 min-w-max">
            <button
              onClick={() => navigate("/shop")}
              className={`px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-sm transition-colors whitespace-nowrap ${!category ? "bg-[#111] text-white" : "text-gray-500 hover:text-[#111]"}`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/collections/${cat}`)}
                className={`px-4 py-1.5 text-[10px] tracking-widest uppercase rounded-sm transition-colors whitespace-nowrap ${category === cat ? "bg-[#111] text-white" : "text-gray-500 hover:text-[#111]"}`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 tracking-wider">
            {loading ? "Loading..." : `${products.length} products`}
          </p>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 text-xs text-[#1a1a1a] tracking-wider uppercase border border-[#ddd] px-4 py-2 hover:border-[#111] transition-colors"
            >
              <SlidersHorizontal size={12} />
              {SORT_OPTIONS.find((o) => o.value === sort)?.label || "SORT BY"}
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 py-1 shadow-xl z-20 rounded-sm"
                style={{ backgroundColor: "#fff", border: "1px solid #e0dbd4" }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs tracking-wider transition-colors ${sort === opt.value ? "text-[#E8272A]" : "text-gray-600 hover:text-[#111] hover:bg-[#FAF7F2]"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-sm mb-4">No products found in this category yet.</p>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs tracking-widest uppercase text-white px-6 py-3"
              style={{ backgroundColor: "#E8272A" }}
            >
              SHOP ALL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
