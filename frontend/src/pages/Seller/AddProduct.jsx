import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct, addVariant } from "../../services/product.api";
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  Image as ImageIcon 
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Backpack",
  "Laptop Bag",
  "Messenger Bag",
  "Sling Bag",
  "Duffel Bag",
  "Travel Bag",
  "Leather Bag",
  "Gym Bag",
  "Wallet",
  "Other"
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Main product form
  const [formData, setFormData] = useState({
    tittle: "",
    description: "",
    category: "Backpack",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Variants state
  const [variants, setVariants] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 7) {
      toast.error("Maximum 7 images allowed");
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  // Variant operations
  const addVariantItem = () => {
    setVariants([
      ...variants,
      {
        color: "Black",
        size: "Standard",
        stock: 10,
        priceAmount: formData.priceAmount || 1999,
        priceCurrency: "INR",
        images: [],
      },
    ]);
  };

  const updateVariantField = (idx, field, value) => {
    const next = [...variants];
    next[idx][field] = value;
    setVariants(next);
  };

  const removeVariantItem = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tittle || !formData.description || !formData.priceAmount) {
      toast.error("Please fill all required product details");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least 1 product image");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("tittle", formData.tittle);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("priceAmount", formData.priceAmount);
      form.append("priceCurrency", formData.priceCurrency);

      images.forEach((img) => {
        form.append("images", img);
      });

      const res = await createProduct(form);
      const createdProd = res.data.product;

      // Add variants if specified
      if (variants.length > 0 && createdProd?._id) {
        for (const v of variants) {
          const vForm = new FormData();
          vForm.append("stock", v.stock);
          vForm.append("priceAmount", v.priceAmount);
          vForm.append("priceCurrency", v.priceCurrency);
          vForm.append(
            "attributes",
            JSON.stringify({ color: v.color, size: v.size })
          );
          await addVariant(createdProd._id, vForm);
        }
      }

      toast.success("Product published successfully!");
      navigate("/seller");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/seller"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#111] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Seller Hub
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#111]">
              Publish New Product
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add photos, set pricing, assign categories, and optionally configure color or size variants.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="tittle"
                  required
                  value={formData.tittle}
                  onChange={handleInputChange}
                  placeholder="e.g. Croco Duffle Bag with Side Pocket"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Product Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Engineered for high mobility. Features weather-resistant leather, YKK zippers, dedicated padded laptop sleeve, and ergonomic straps."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm resize-none"
              />
            </div>

            {/* Price & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Base Price (Amount) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    name="priceAmount"
                    required
                    min={1}
                    value={formData.priceAmount}
                    onChange={handleInputChange}
                    placeholder="2499"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Currency
                </label>
                <select
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm bg-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Product Images (Up to 7) *
              </label>

              <div className="border-2 border-dashed border-gray-200 hover:border-[#E8272A] transition-colors rounded-2xl p-6 text-center bg-[#FAF7F2]/50">
                <input
                  type="file"
                  id="prod-images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="prod-images"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#E8272A] mb-3">
                    <Upload size={22} />
                  </div>
                  <span className="text-sm font-bold text-[#111]">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP up to 5MB each
                  </span>
                </label>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-white border border-gray-200 p-1 flex items-center justify-center"
                    >
                      <img src={src} alt="Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Variants (Optional) */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#111] flex items-center gap-2">
                    <Layers size={18} className="text-[#E8272A]" /> Optional Variants
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add specific color ways, dimensions, or capacities with custom pricing & stock.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariantItem}
                  className="px-4 py-2 border border-gray-200 hover:border-[#111] text-[#111] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Variant
                </button>
              </div>

              {variants.length > 0 && (
                <div className="space-y-4 mt-4">
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
                    >
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Color</label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => updateVariantField(idx, "color", e.target.value)}
                          placeholder="e.g. Navy Blue"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Size / Dimension</label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => updateVariantField(idx, "size", e.target.value)}
                          placeholder="e.g. 24L / Standard"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Stock Units</label>
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) => updateVariantField(idx, "stock", e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          min={1}
                          value={v.priceAmount}
                          onChange={(e) => updateVariantField(idx, "priceAmount", e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeVariantItem(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove Variant"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/seller")}
                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-[#E8272A] hover:bg-[#c41e21] text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Publish Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
