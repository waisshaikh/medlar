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

// Seller queries
router.get("/seller", authenticateSeller, getSellerProduct);
router.get("/seller/all", authenticateSeller, getSellerProduct);

// Public product details
router.get("/product/:productId", getProductDetail);
router.get("/:productId", getProductDetail);
router.get("/", getAllProduct);

// Seller mutations
router.post("/", authenticateSeller, upload.array("images", 10), productValidator, createProduct);
router.put("/seller/product/:productId", authenticateSeller, upload.array("images", 10), updateProduct);
router.put("/:productId", authenticateSeller, upload.array("images", 10), updateProduct);
router.delete("/seller/product/:productId", authenticateSeller, deleteProduct);
router.delete("/:productId", authenticateSeller, deleteProduct);

// Variant routes
router.post("/seller/product/:productId/variants", authenticateSeller, upload.array("images", 10), addProductVarient);
router.post("/:productId/variants", authenticateSeller, upload.array("images", 10), addProductVarient);
router.put("/seller/product/:productId/variants/:variantId", authenticateSeller, upload.array("images", 10), updateVariant);
router.put("/:productId/variants/:variantId", authenticateSeller, upload.array("images", 10), updateVariant);
router.patch("/seller/product/:productId/variants/:variantId/stock", authenticateSeller, updateVariantStock);
router.patch("/:productId/variants/:variantId/stock", authenticateSeller, updateVariantStock);
router.delete("/seller/product/:productId/variants/:variantId", authenticateSeller, deleteVariant);
router.delete("/:productId/variants/:variantId", authenticateSeller, deleteVariant);

export default router;
