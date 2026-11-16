import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Facebook, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const shopLinks = [
  { label: "Backpacks", to: "/collections/backpacks" },
  { label: "Laptop/Office Bags", to: "/collections/laptop-bags" },
  { label: "Messenger Bags", to: "/collections/messenger-bags" },
  { label: "Sling Bags", to: "/collections/sling-bags" },
  { label: "Duffel Bags", to: "/collections/duffel-bags" },
  { label: "Travel Bags", to: "/collections/travel-bags" },
  { label: "Leather Bags", to: "/collections/leather-bags" },
];

const supportLinks = [
  { label: "Contact Us", to: "/contact" },
  { label: "Shipping & Returns", to: "/shipping" },
  { label: "Warranty", to: "/warranty" },
  { label: "FAQs", to: "/faqs" },
];

const companyLinks = [
  { label: "Our Story", to: "/our-story" },
  { label: "Journal", to: "/journal" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer style={{ backgroundColor: "#111111", color: "#fff" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: "#E8272A" }}>
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-white font-semibold tracking-[0.2em] text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                MEDLAR
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Premium travel gear engineered in India. Built for the journey. Refined at every altitude.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex items-stretch mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-white text-xs border border-[#333] outline-none focus:border-[#E8272A] transition-colors placeholder-gray-600 rounded-l-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 flex items-center justify-center hover:opacity-90 transition-opacity rounded-r-sm"
                style={{ backgroundColor: "#E8272A" }}
              >
                <ArrowRight size={16} className="text-white" />
              </button>
            </form>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E8272A] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E8272A] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E8272A] transition-colors">
                <Youtube size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E8272A] transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">SHOP</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-gray-400 text-xs hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">SUPPORT</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-gray-400 text-xs hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase mb-4 font-medium">COMPANY</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-gray-400 text-xs hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{ borderTop: "1px solid #222" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Medlar. All rights reserved. Made in India 🇮🇳
          </p>
          <p className="text-gray-600 text-xs">
            Designed for every journey.
          </p>
        </div>
      </div>
    </footer>
  );
}
