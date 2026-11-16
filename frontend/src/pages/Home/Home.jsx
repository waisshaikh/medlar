import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { fetchProducts } from "../../store/slices/productSlice.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";

const categories = [
  { name: "Backpacks", slug: "backpacks", img: "/catalog/page_003.png" },
  { name: "Laptop Bags", slug: "laptop-bags", img: "/catalog/page_010.png" },
  { name: "Messenger Bags", slug: "messenger-bags", img: "/catalog/page_020.png" },
  { name: "Sling Bags", slug: "sling-bags", img: "/catalog/page_030.png" },
  { name: "Duffel Bags", slug: "duffel-bags", img: "/catalog/page_040.png" },
  { name: "Travel Bags", slug: "travel-bags", img: "/catalog/page_050.png" },
  { name: "Leather Bags", slug: "leather-bags", img: "/catalog/page_060.png" },
];

const testimonials = [
  { name: "Rahul M.", rating: 5, text: "Absolutely love the craftsmanship. My backpack has been with me across 12 countries and still looks brand new.", city: "Mumbai" },
  { name: "Priya S.", rating: 5, text: "The laptop bag fits perfectly and the build quality is unmatched for the price. Worth every rupee.", city: "Bangalore" },
  { name: "Arjun K.", rating: 4, text: "Great quality bags. The leather finish is premium and the stitching is immaculate. Would recommend.", city: "Delhi" },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: products, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <div className="pt-16 md:pt-20">
      {/* ─── HERO ─────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: "#111111" }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span
                className="inline-block text-[10px] tracking-[0.4em] uppercase mb-6 px-3 py-1 border"
                style={{ borderColor: "#E8272A", color: "#E8272A" }}
              >
                PREMIUM TRAVEL GEAR — MADE IN INDIA
              </span>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-8 text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                BUILT FOR
                <br />
                <span style={{ color: "#E8272A" }}>EVERY</span>
                <br />
                JOURNEY.
              </h1>

              <p className="text-gray-400 text-base mb-10 max-w-sm leading-relaxed">
                Engineered for the roads less travelled. Crafted for the moments worth carrying.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 px-8 py-4 text-white text-xs tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#E8272A" }}
                >
                  SHOP NOW <ArrowRight size={14} />
                </Link>
                <Link
                  to="/collections/backpacks"
                  className="flex items-center justify-center px-8 py-4 text-white text-xs tracking-[0.2em] uppercase font-medium border border-white hover:bg-white hover:text-[#111] transition-colors"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8" style={{ borderTop: "1px solid #333" }}>
                {[
                  { val: "4★", label: "avg rating" },
                  { val: "9yr", label: "in business" },
                  { val: "1,80,000+", label: "journeys" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-white text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{s.val}</p>
                    <p className="text-gray-500 text-[10px] tracking-widest uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div
                className="absolute inset-0 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: "#E8272A" }}
              />
              <img
                src="/catalog/page_003.png"
                alt="Medlar Premium Bag"
                className="relative z-10 w-full max-w-lg object-contain"
                style={{ maxHeight: "80vh" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY SHOWCASE ─────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[10px] text-[#E8272A] tracking-[0.4em] uppercase">Collections</span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-2 text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built for every kind of journey
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/collections/${cat.slug}`)}
                className="group cursor-pointer rounded-sm overflow-hidden relative"
                style={{ backgroundColor: "#111" }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-[10px] tracking-[0.1em] uppercase font-medium leading-tight">
                      {cat.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BESTSELLERS ─────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#111111" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] text-[#E8272A] tracking-[0.4em] uppercase">Top Picks</span>
              <h2
                className="text-3xl sm:text-4xl font-bold mt-2 text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bestsellers, proven on the road
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-1 text-xs text-gray-400 hover:text-[#E8272A] tracking-widest uppercase transition-colors"
            >
              VIEW ALL <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-sm overflow-hidden animate-pulse" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="h-56" style={{ backgroundColor: "#222" }} />
                  <div className="p-4 space-y-2">
                    <div className="h-3 rounded" style={{ backgroundColor: "#333" }} />
                    <div className="h-3 w-2/3 rounded" style={{ backgroundColor: "#333" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── BRAND STORY ─────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[10px] text-[#E8272A] tracking-[0.4em] uppercase">Our Story</span>
              <h2
                className="text-3xl sm:text-4xl font-bold mt-3 mb-6 text-[#1a1a1a] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tested at 40,000 feet. Refined at street level.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Every Medlar bag starts as an obsession. We travel to understand what a bag needs to do, then we design it to do exactly that — nothing more, nothing less. Premium materials, honest craftsmanship, built to last.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { val: "4★", label: "Customer Rating" },
                  { val: "9yr", label: "In Business" },
                  { val: "1,80,000+", label: "Happy Travellers" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-sm" style={{ backgroundColor: "#fff", border: "1px solid #e0dbd4" }}>
                    <p className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>{s.val}</p>
                    <p className="text-gray-500 text-[9px] tracking-widest uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[#1a1a1a] border border-[#1a1a1a] px-6 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                READ OUR STORY <ArrowRight size={12} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-sm overflow-hidden" style={{ backgroundColor: "#111" }}>
                <img
                  src="/catalog/page_015.png"
                  alt="Medlar Story"
                  className="w-full h-full object-contain p-6"
                />
              </div>
              <div
                className="absolute -bottom-6 -left-6 p-6 rounded-sm shadow-xl hidden md:block"
                style={{ backgroundColor: "#E8272A" }}
              >
                <p className="text-white text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>9+</p>
                <p className="text-white/80 text-[10px] tracking-widest uppercase">Years of craft</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#111111" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[10px] text-[#E8272A] tracking-[0.4em] uppercase">Reviews</span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-2 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Carried by 2,00,000+ travellers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} size={12} fill="#C9A84C" stroke="#C9A84C" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid #333" }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: "#E8272A" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{t.name}</p>
                    <p className="text-gray-500 text-[10px]">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-[10px] text-[#E8272A] tracking-[0.4em] uppercase">Stay Connected</span>
          <h2
            className="text-3xl font-bold mt-2 mb-4 text-[#1a1a1a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join the journey
          </h2>
          <p className="text-gray-500 text-sm mb-8">Get travel stories, exclusive offers and new arrivals — delivered to your inbox.</p>
          <form
            className="flex gap-0 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 text-sm bg-white border border-[#ddd] outline-none focus:border-[#E8272A] transition-colors rounded-l-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 text-white text-xs tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#E8272A" }}
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
