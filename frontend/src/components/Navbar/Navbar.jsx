import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, User } from "lucide-react";
import { toggleCart } from "../../store/slices/cartSlice.js";
import { logout } from "../../store/slices/authSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const categories = [
  "Backpacks",
  "Laptop Bags",
  "Messenger Bags",
  "Sling Bags",
  "Duffel Bags",
  "Travel Bags",
  "Leather Bags",
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCollectionsOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Signed out");
    navigate("/");
    setUserMenuOpen(false);
  };

  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-2xl" : ""
      }`}
      style={{ backgroundColor: "#111111" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-sm"
              style={{ backgroundColor: "#E8272A" }}
            >
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span
              className="text-white font-semibold tracking-[0.2em] text-sm"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              MEDLAR
            </span>
          </Link>

          {/* Center Nav — desktop */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            <Link
              to="/shop"
              className="text-white text-xs tracking-[0.15em] uppercase hover:text-[#E8272A] transition-colors font-medium"
            >
              SHOP
            </Link>

            {/* Collections dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-white text-xs tracking-[0.15em] uppercase hover:text-[#E8272A] transition-colors font-medium"
                onClick={() => setCollectionsOpen((o) => !o)}
              >
                COLLECTIONS <ChevronDown size={12} className={`transition-transform ${collectionsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-3 w-52 py-2 rounded-sm shadow-2xl"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/collections/${cat.toLowerCase().replace(/ /g, "-")}`}
                        className="block px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#E8272A] tracking-widest uppercase transition-colors"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/journal"
              className="text-white text-xs tracking-[0.15em] uppercase hover:text-[#E8272A] transition-colors font-medium"
            >
              JOURNAL
            </Link>
            <Link
              to="/our-story"
              className="text-white text-xs tracking-[0.15em] uppercase hover:text-[#E8272A] transition-colors font-medium"
            >
              OUR STORY
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <button
                className="text-white hover:text-[#E8272A] transition-colors p-1"
                onClick={() => setSearchOpen((o) => !o)}
              >
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 200 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="absolute right-0 top-full mt-2 overflow-hidden"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }
                      }}
                      placeholder="Search bags..."
                      className="w-full px-3 py-2 text-xs text-white bg-[#1a1a1a] border border-[#333] outline-none focus:border-[#E8272A] rounded-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="text-white hover:text-[#E8272A] transition-colors p-1 hidden md:block">
              <Heart size={18} />
            </button>

            {/* Cart */}
            <button
              className="relative text-white hover:text-[#E8272A] transition-colors p-1"
              onClick={() => dispatch(toggleCart())}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E8272A" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                className="text-white hover:text-[#E8272A] transition-colors p-1"
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                <User size={18} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-44 py-2 rounded-sm shadow-2xl"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-[#333]">
                          <p className="text-white text-xs font-medium truncate">{user.fullname}</p>
                          <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="block px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f1f1f] tracking-wider transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        {user.role === "seller" && (
                          <Link
                            to="/seller"
                            className="block px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f1f1f] tracking-wider transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Seller Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#E8272A] hover:bg-[#1f1f1f] tracking-wider transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f1f1f] tracking-wider transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#1f1f1f] tracking-wider transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-1"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ backgroundColor: "#1a1a1a", borderTop: "1px solid #333" }}
          >
            <div className="px-6 py-4 space-y-1">
              <Link
                to="/shop"
                className="block py-3 text-xs text-white tracking-widest uppercase border-b border-[#333]"
                onClick={() => setMobileOpen(false)}
              >
                SHOP
              </Link>
              <div>
                <button
                  className="flex w-full justify-between items-center py-3 text-xs text-white tracking-widest uppercase border-b border-[#333]"
                  onClick={() => setCollectionsOpen((o) => !o)}
                >
                  COLLECTIONS <ChevronDown size={12} className={`transition-transform ${collectionsOpen ? "rotate-180" : ""}`} />
                </button>
                {collectionsOpen && (
                  <div className="pl-4 py-2 space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/collections/${cat.toLowerCase().replace(/ /g, "-")}`}
                        className="block py-2 text-xs text-gray-400 hover:text-white tracking-wider"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="block py-3 text-xs text-white tracking-widest uppercase border-b border-[#333]"
                    onClick={() => setMobileOpen(false)}
                  >
                    MY ORDERS
                  </Link>
                  {user.role === "seller" && (
                    <Link
                      to="/seller"
                      className="block py-3 text-xs text-white tracking-widest uppercase border-b border-[#333]"
                      onClick={() => setMobileOpen(false)}
                    >
                      SELLER DASHBOARD
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-3 text-xs text-[#E8272A] tracking-widest uppercase"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-3 text-xs text-white tracking-widest uppercase border-b border-[#333]"
                    onClick={() => setMobileOpen(false)}
                  >
                    SIGN IN
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 text-xs text-white tracking-widest uppercase"
                    onClick={() => setMobileOpen(false)}
                  >
                    CREATE ACCOUNT
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
