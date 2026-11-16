import crypto from "crypto";
import paymentModel from "../models/payment.model.js";
import cartModel from "../models/cart.model.js";
import { config } from "../config/config.js";

export const createPendingPaymentController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentModel.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Get pending payment error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await paymentModel.findOneAndUpdate(
      { "razorpay.orderId": razorpay_order_id },
      {
        status: "paid",
        "razorpay.paymentId": razorpay_payment_id,
        "razorpay.signature": razorpay_signature,
      },
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: "Payment record not found" });

    // Clear the user's cart after successful payment
    await cartModel.findOneAndUpdate({ user: payment.user }, { items: [] });

    return res.status(200).json({ success: true, message: "Payment verified successfully", payment });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPaymentByIdController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentModel.findById(paymentId).populate("user", "fullname email");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Get payment by id error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserPaymentsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await paymentModel.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Get user payments error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPaymentByOrderIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentModel.findOne({ "razorpay.orderId": orderId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Get payment by order id error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSellerOrdersController = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const payments = await paymentModel.find({
      "orderitems.seller": sellerId,
      status: "paid",
    }).populate("user", "fullname email contact").sort({ createdAt: -1 });

    // Filter order items to only those belonging to this seller
    const filteredPayments = payments.map((payment) => ({
      ...payment.toObject(),
      orderitems: payment.orderitems.filter(
        (item) => item.seller && item.seller.toString() === sellerId.toString()
      ),
    }));

    return res.status(200).json({ success: true, orders: filteredPayments });
  } catch (error) {
    console.error("Get seller orders error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSellerOrderStatusController = async (req, res) => {
  try {
    const { paymentId, itemId } = req.params;
    const { orderStatus } = req.body;
    const sellerId = req.user._id;

    const validStatuses = ["Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const payment = await paymentModel.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const orderItem = payment.orderitems.id(itemId);
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    if (orderItem.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this order item" });
    }

    orderItem.orderStatus = orderStatus;
    await payment.save();

    return res.status(200).json({ success: true, message: "Order status updated", payment });
  } catch (error) {
    console.error("Update seller order status error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
