import { Router } from "express";
import {
  cartController,
  getCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
  createOrderController,
} from "../controllers/cart.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/Cart.validator.js";

const router = Router();

router.use(authenticateUser);

router.get("/", getCartController);
router.post("/add/:productId/:variantId?", validateAddToCart, cartController);
router.patch("/item/:itemId", updateCartItemController);
router.delete("/item/:itemId", removeCartItemController);
router.delete("/clear", clearCartController);
router.post("/create-order", createOrderController);

export default router;
