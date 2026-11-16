import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserPayments } from "../../services/payment.api";
import { logout } from "../../store/slices/authSlice";
import { Package, Clock, LogOut, CheckCircle2, ChevronRight, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getUserPayments();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#111] text-white flex items-center justify-center font-serif text-2xl font-bold">
              {user?.fullname?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-black text-[#111] tracking-tight">{user?.fullname}</h1>
              <p className="text-sm text-gray-500">{user?.email} • {user?.contact || "No contact"}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                Role: {user?.role || "Buyer"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {user?.role === "seller" && (
              <button
                onClick={() => navigate("/seller")}
                className="px-4 py-2 bg-[#E8272A] hover:bg-[#c41e21] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Seller Portal
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111] mb-6 flex items-center gap-2">
            <Package className="text-[#E8272A]" size={24} /> Order History
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#E8272A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#111] mb-2">No Orders Placed Yet</h3>
              <p className="text-sm text-gray-500 mb-6">Explore our curated collections of backpacks, messenger bags, and duffels.</p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-[#111] hover:bg-[#E8272A] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 text-xs sm:text-sm">
                      <div className="flex gap-6">
                        <div>
                          <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Order ID</span>
                          <span className="font-mono font-bold text-gray-800">#{order._id.slice(-8)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Placed On</span>
                          <span className="font-semibold text-gray-800">{dateStr}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Total</span>
                          <span className="font-bold text-[#E8272A]">₹{order.price?.amount?.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 divide-y divide-gray-100">
                      {order.orderitems?.map((item, idx) => (
                        <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#FAF7F2] rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-gray-100">
                              <img
                                src={item.images?.[0]?.url || "/catalog/page_003.png"}
                                alt={item.tittle}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-[#111] text-sm sm:text-base line-clamp-1">{item.tittle}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                              <span className="inline-block mt-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                Status: {item.orderStatus || "Confirmed"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-serif font-bold text-sm text-[#111]">
                              ₹{(item.price?.amount * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.shippingAddress && (
                      <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Delivering to: </span>
                        {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
