import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSellerProducts, deleteProduct } from "../../services/product.api";
import { logout } from "../../store/slices/authSlice";
import { 
  Plus, 
  Package, 
  ShoppingBag, 
  Trash2, 
  Edit, 
  TrendingUp, 
  ExternalLink,
  Layers,
  LogOut 
} from "lucide-react";
import toast from "react-hot-toast";

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getSellerProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load seller products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#E8272A] text-white">
                Seller Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#111]">
                Welcome, {user?.fullname}
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your catalog, inventory, variants, and customer orders.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/seller/orders"
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} /> View Orders
            </Link>
            <Link
              to="/seller/add-product"
              className="px-5 py-2.5 bg-[#E8272A] hover:bg-[#c41e21] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} /> Add New Product
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-50 text-[#E8272A] flex items-center justify-center shrink-0">
              <Package size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Products</p>
              <p className="text-3xl font-serif font-black text-[#111] mt-0.5">{products.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Layers size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Variants</p>
              <p className="text-3xl font-serif font-black text-[#111] mt-0.5">
                {products.reduce((acc, p) => acc + (p.variants?.length || 0), 0)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Platform Status</p>
              <p className="text-xl font-serif font-bold text-green-700 mt-1">Live & Active</p>
            </div>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-[#111]">Listed Inventory</h2>
            <span className="text-xs font-semibold text-gray-400">{products.length} Items Listed</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#E8272A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#111] mb-2">No Products in Your Catalog</h3>
              <p className="text-sm text-gray-500 mb-6">Start selling by uploading your first backpack or travel duffel.</p>
              <Link
                to="/seller/add-product"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E8272A] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#c41e21] transition-colors"
              >
                <Plus size={18} /> Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Base Price</th>
                    <th className="py-4 px-6">Variants</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.map((p) => {
                    const img = (p.images && p.images[0]) || "/catalog/page_003.png";
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#FAF7F2] rounded-lg p-1 flex items-center justify-center shrink-0 border border-gray-100">
                              <img src={img} alt={p.tittle} className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-[#111] line-clamp-1">{p.tittle}</p>
                              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {p.category || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-serif font-bold text-[#E8272A]">
                          ₹{p.price?.amount?.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {p.variants?.length ? (
                            <span className="font-semibold text-gray-900">{p.variants.length} variant(s)</span>
                          ) : (
                            <span className="text-xs text-gray-400">Standard only</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <Link
                            to={`/product/${p._id}`}
                            className="p-2 text-gray-400 hover:text-[#111] inline-block transition-colors"
                            title="Preview on Storefront"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 text-gray-400 hover:text-red-600 inline-block transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
