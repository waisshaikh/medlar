import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../../services/payment.api";
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getSellerOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (paymentId, productId, newStatus) => {
    setUpdatingId(`${paymentId}-${productId}`);
    try {
      await updateOrderStatus({
        paymentId,
        productId,
        orderStatus: newStatus,
      });

      toast.success(`Order status updated to ${newStatus}`);

      // Update local state
      setOrders(
        orders.map((ord) => {
          if (ord.paymentId === paymentId && ord.item?.productId === productId) {
            return { ...ord, orderStatus: newStatus };
          }
          return ord;
        })
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/seller"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#111] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Seller Hub
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#111]">
                Customer Orders for Your Gear
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track fulfilment, dispatch shipments, and update parcel milestones.
              </p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">
              {orders.length} Order Items
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#E8272A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#111] mb-2">No Customer Orders Yet</h3>
              <p className="text-sm text-gray-500">
                Orders for your products will automatically appear here once customers complete payment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Ordered Product</th>
                    <th className="py-4 px-6">Buyer & Contact</th>
                    <th className="py-4 px-6">Shipping Address</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Current Status</th>
                    <th className="py-4 px-6 text-right">Update Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((ord, idx) => {
                    const item = ord.item || {};
                    const buyer = ord.buyer || {};
                    const addr = ord.shippingAddress || {};
                    const isUpdating = updatingId === `${ord.paymentId}-${item.productId}`;

                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#FAF7F2] rounded-lg p-1 flex items-center justify-center shrink-0 border border-gray-100">
                              <img
                                src={item.image || "/catalog/page_003.png"}
                                alt={item.tittle}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-[#111] line-clamp-1">{item.tittle}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-800">{buyer.name}</p>
                          <p className="text-xs text-gray-500">{buyer.email}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{buyer.phone}</p>
                        </td>

                        <td className="py-4 px-6 max-w-xs">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {addr.street ? `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}` : "Not provided"}
                          </p>
                        </td>

                        <td className="py-4 px-6 font-serif font-bold text-[#E8272A]">
                          ₹{((item.price?.amount || 0) * (item.quantity || 1)).toLocaleString()}
                        </td>

                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <select
                            disabled={isUpdating}
                            value={ord.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(ord.paymentId, item.productId, e.target.value)
                            }
                            className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] bg-white cursor-pointer disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
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
