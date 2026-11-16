import Razorpay from "razorpay";
import { config } from "../config/config.js";

const getRazorpayInstance = () => {
  const key_id = config.RAZORPAY_KEY_ID || "rzp_test_placeholder";
  const key_secret = config.RAZORPAY_KEY_SECRET || "dummy_secret_placeholder";
  return new Razorpay({ key_id, key_secret });
};

export const createOrder = async ({ amount, currency = "INR" }) => {
  const razorpay = getRazorpayInstance();
  const options = { amount: Math.round(amount * 100), currency };
  const order = await razorpay.orders.create(options);
  return order;
};
