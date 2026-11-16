import { Router } from "express";
import {
  createProduct,
  getSellerProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
  addProductVarient,
  updateVariant,
  updateVariantStock,
  deleteVariant,
  upload,
} from "../controllers/product.controller.js";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { productValidator } from "../validator/product.validator.js";

const router = Router();

// Public routes
router.get("/", getAllProduct);
router.get("/:productId", getProductDetail);

// Seller routes
router.post("/", authenticateSeller, upload.array("images", 10), productValidator, createProduct);
router.get("/seller/all", authenticateSeller, getSellerProduct);
router.put("/:productId", authenticateSeller, upload.array("images", 10), updateProduct);
router.delete("/:productId", authenticateSeller, deleteProduct);

// Variant routes
router.post("/:productId/variants", authenticateSeller, upload.array("images", 10), addProductVarient);
router.put("/:productId/variants/:variantId", authenticateSeller, upload.array("images", 10), updateVariant);
router.patch("/:productId/variants/:variantId/stock", authenticateSeller, updateVariantStock);
router.delete("/:productId/variants/:variantId", authenticateSeller, deleteVariant);

export default router;
