import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useRazorpay from "react-razorpay";
import { fetchCart, clearCart } from "../../store/slices/cartSlice";
import { createPendingPayment, verifyPayment } from "../../services/payment.api";
import { createRazorpayOrder } from "../../services/cart.api";
import toast from "react-hot-toast";
import { ShieldCheck, Lock, Truck, CreditCard } from "lucide-react";

export default function Checkout() {
  const [Razorpay] = useRazorpay();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullname || "",
    phone: user?.contact || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/shop");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend via Razorpay service
      const orderRes = await createRazorpayOrder();
      const order = orderRes.data.order;

      // 2. Setup Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "MEDLAR",
        description: "Premium Travel Gear Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            // Create pending payment record
            await createPendingPayment({
              orderId: response.razorpay_order_id,
              amount: totalPrice,
              currency: "INR",
              shippingAddress: formData,
            });

            // Verify payment signature
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful! Your order is placed.");
              dispatch(clearCart());
              navigate("/account");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: formData.fullName,
          email: user?.email || "",
          contact: formData.phone,
        },
        theme: {
          color: "#E8272A",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-black text-[#111] mb-2 tracking-tight">Checkout</h1>
        <p className="text-gray-500 mb-8">Enter your delivery details to complete your order.</p>

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-serif font-bold text-[#111] mb-6 flex items-center gap-2">
                <Truck className="text-[#E8272A]" size={22} /> Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                    placeholder="9876543210"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                    placeholder="Maharashtra"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E8272A] text-sm"
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="text-[#E8272A]" size={24} />
                <div>
                  <p className="font-bold text-sm text-[#111]">Razorpay Secure Checkout</p>
                  <p className="text-xs text-gray-400">Cards, UPI, Netbanking, & Wallets supported</p>
                </div>
              </div>
              <ShieldCheck className="text-green-600" size={24} />
            </div>
          </div>

          {/* Order Summary & Submit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[#111] mb-6">Your Order</h2>

              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto mb-6">
                {items.map((item) => {
                  const product = item.product || {};
                  const price = item.price?.amount || product.price?.amount || 0;
                  const itemImg = (product.images && product.images[0]) || "/catalog/page_003.png";

                  return (
                    <div key={item._id} className="py-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#FAF7F2] rounded p-1 flex items-center justify-center shrink-0 border border-gray-100">
                        <img src={itemImg} alt={product.tittle} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#111] truncate">{product.tittle}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-[#111]">
                        ₹{(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm text-gray-600 py-4 border-t border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111]">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>

              <div className="py-4 flex justify-between items-center mb-6">
                <span className="font-bold text-base text-[#111]">Total to Pay</span>
                <span className="font-serif font-black text-2xl text-[#E8272A]">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E8272A] hover:bg-[#c41e21] text-white py-4 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} /> Pay ₹{totalPrice.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
