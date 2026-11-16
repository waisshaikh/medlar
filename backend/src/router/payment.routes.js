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

// User routes
router.get("/my-orders", authenticateUser, getUserPaymentsController);
router.get("/order/:orderId", authenticateUser, getPaymentByOrderIdController);
router.get("/:paymentId", authenticateUser, createPendingPaymentController);
router.get("/detail/:paymentId", authenticateUser, getPaymentByIdController);
router.post("/verify", authenticateUser, verifyPaymentController);

// Seller routes
router.get("/seller/orders", authenticateSeller, getSellerOrdersController);
router.patch("/seller/orders/:paymentId/items/:itemId/status", authenticateSeller, updateSellerOrderStatusController);

export default router;
