import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { getCartDetails } from "../dao/cartDetail.dao.js";
import paymentModel from "../models/payment.model.js";
import { createOrder } from "../services/payment.service.js";

export const cartController = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let itemPrice;
    let resolvedVariantId = null;

    if (variantId && variantId !== "main" && variantId !== "undefined" && variantId !== "null") {
      const variant = product.variants.id(variantId);
      if (!variant) return res.status(404).json({ message: "Variant not found" });
      itemPrice = variant.price;
      resolvedVariantId = variant._id;
    } else {
      itemPrice = product.price;
    }

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex((item) => {
      const productMatch = item.product.toString() === productId;
      const variantMatch = resolvedVariantId
        ? item.variant && item.variant.toString() === resolvedVariantId.toString()
        : !item.variant;
      return productMatch && variantMatch;
    });

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        variant: resolvedVariantId,
        quantity: Number(quantity),
        price: itemPrice,
      });
    }

    await cart.save();
    const cartDetails = await getCartDetails(userId);
    return res.status(200).json({ message: "Item added to cart", success: true, cart: cartDetails[0] });
  } catch (error) {
    console.error("Cart error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartDetails = await getCartDetails(userId);
    return res.status(200).json({ success: true, cart: cartDetails[0] || null });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCartItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = Number(quantity);
    await cart.save();

    const cartDetails = await getCartDetails(userId);
    return res.status(200).json({ message: "Cart item updated", success: true, cart: cartDetails[0] });
  } catch (error) {
    console.error("Update cart item error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeCartItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const cartDetails = await getCartDetails(userId);
    return res.status(200).json({ message: "Item removed from cart", success: true, cart: cartDetails[0] });
  } catch (error) {
    console.error("Remove cart item error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const clearCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    await cartModel.findOneAndUpdate({ user: userId }, { items: [] });
    return res.status(200).json({ message: "Cart cleared successfully", success: true });
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    const cartDetails = await getCartDetails(userId);
    if (!cartDetails || cartDetails.length === 0 || !cartDetails[0]?.items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cart = cartDetails[0];
    const totalAmount = cart.totalPrice;
    const currency = cart.currency || "INR";

    const razorpayOrder = await createOrder({ amount: totalAmount, currency });

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await productModel.findById(item.product._id || item.product);
        return {
          tittle: product?.tittle || "Unknown Product",
          productId: product?._id,
          variantId: item.variant || null,
          quantity: item.quantity,
          images: product?.images?.map((url) => ({ url })) || [],
          price: item.price,
          seller: product?.seller,
          orderStatus: "Confirmed",
        };
      })
    );

    const payment = await paymentModel.create({
      status: "pending",
      price: { amount: totalAmount, currency },
      razorpay: { orderId: razorpayOrder.id },
      user: userId,
      shippingAddress,
      orderitems: orderItems,
    });

    return res.status(201).json({
      success: true,
      message: "Order created",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
