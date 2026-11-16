import { Router } from "express";
import {
  createPendingPaymentController,
  verifyPaymentController,
  getPaymentByIdController,
  getUserPaymentsController,
  getPaymentByOrderIdController,
  getSellerOrdersController,
  updateSellerOrderStatusController,
} from "../controllers/payment.controller.js";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.middleware.js";

const router = Router();

// Seller routes (specific paths first)
router.get("/seller/orders", authenticateSeller, getSellerOrdersController);
router.patch("/seller/orders/status", authenticateSeller, updateSellerOrderStatusController);
router.patch("/seller/orders/:paymentId/items/:itemId/status", authenticateSeller, updateSellerOrderStatusController);

// User payment creation & verification
router.post("/create", authenticateUser, createPendingPaymentController);
router.post("/verify", authenticateUser, verifyPaymentController);

// User payment queries
router.get("/my-orders", authenticateUser, getUserPaymentsController);
router.get("/order/:orderId", authenticateUser, getPaymentByOrderIdController);
router.get("/detail/:paymentId", authenticateUser, getPaymentByIdController);
router.get("/:paymentId", authenticateUser, getPaymentByIdController);
router.get("/", authenticateUser, getUserPaymentsController);

export default router;
