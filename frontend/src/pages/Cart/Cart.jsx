import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateItem, removeItem, clearCart } from "../../store/slices/cartSlice";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, currency, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantity = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      dispatch(removeItem(itemId));
    } else {
      dispatch(updateItem({ itemId, quantity: newQty }));
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#E8272A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#111] mb-6">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111] mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Looks like you haven't added any premium gear to your cart yet. Explore our handcrafted collections built for every journey.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Start Shopping <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#111] mb-2 tracking-tight">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">Review your chosen items before proceeding to checkout.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 divide-y divide-gray-100">
                {items.map((item) => {
                  const product = item.product || {};
                  const price = item.price?.amount || product.price?.amount || 0;
                  const itemImg = (product.images && product.images[0]) || "/catalog/page_003.png";

                  return (
                    <div key={item._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-24 bg-[#FAF7F2] rounded-lg p-2 flex items-center justify-center shrink-0 border border-gray-100">
                          <img
                            src={itemImg}
                            alt={product.tittle || "Product"}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <Link to={`/product/${product._id}`} className="font-serif font-bold text-lg text-[#111] hover:text-[#E8272A] transition-colors line-clamp-1">
                            {product.tittle || "Product Title"}
                          </Link>
                          <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">
                            {product.category || "Travel Gear"}
                          </p>
                          <div className="font-bold text-[#E8272A] mt-2">
                            ₹{price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleQuantity(item._id, item.quantity, -1)}
                            className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 py-1 text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantity(item._id, item.quantity, 1)}
                            className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <p className="font-serif font-bold text-base text-[#111]">
                            ₹{(price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => dispatch(removeItem(item._id))}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  Clear Cart
                </button>
                <Link to="/shop" className="text-sm text-[#111] hover:text-[#E8272A] font-semibold flex items-center">
                  Continue Shopping <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-[#111] mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm text-gray-600 pb-6 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111]">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-gray-400">Included in price</span>
                </div>
              </div>

              <div className="py-6 flex justify-between items-center">
                <span className="font-bold text-lg text-[#111]">Total Amount</span>
                <span className="font-serif font-black text-2xl text-[#E8272A]">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate(user ? "/checkout" : "/login?redirect=/checkout")}
                className="w-full bg-[#111] hover:bg-[#E8272A] text-white py-4 rounded-xl font-bold tracking-wider uppercase text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <ShieldCheck size={16} className="text-green-600" />
                <span>100% Secure Checkout with Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
