import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export const createProduct = async (req, res) => {
  try {
    const { tittle, description, priceAmount, priceCurrency, category } = req.body;
    const seller = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageUrls = await Promise.all(
      req.files.map((file) =>
        uploadFile({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype })
      )
    );

    const product = await productModel.create({
      tittle,
      description,
      seller,
      category: category || "Other",
      price: { amount: Number(priceAmount), currency: priceCurrency || "INR" },
      images: imageUrls,
    });

    return res.status(201).json({ message: "Product created successfully", success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSellerProduct = async (req, res) => {
  try {
    const seller = req.user._id;
    const products = await productModel.find({ seller });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get seller products error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    const products = await productModel.find(query).populate("seller", "fullname email");
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get all products error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId).populate("seller", "fullname email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product detail error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { tittle, description, priceAmount, priceCurrency, category } = req.body;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }

    let imageUrls = product.images;
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map((file) =>
          uploadFile({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype })
        )
      );
    }

    const updated = await productModel.findByIdAndUpdate(
      productId,
      {
        tittle: tittle || product.tittle,
        description: description || product.description,
        category: category || product.category,
        price: {
          amount: priceAmount ? Number(priceAmount) : product.price.amount,
          currency: priceCurrency || product.price.currency,
        },
        images: imageUrls,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Product updated successfully", success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }
    await productModel.findByIdAndDelete(productId);
    return res.status(200).json({ message: "Product deleted successfully", success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addProductVarient = async (req, res) => {
  try {
    const { productId } = req.params;
    const { priceAmount, priceCurrency, stock, attributes } = req.body;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }

    let variantImages = [];
    if (req.files && req.files.length > 0) {
      const urls = await Promise.all(
        req.files.map((file) =>
          uploadFile({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype })
        )
      );
      variantImages = urls.map((url) => ({ url }));
    }

    let parsedAttributes = {};
    if (attributes) {
      try { parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes; } catch {}
    }

    product.variants.push({
      images: variantImages,
      stock: Number(stock) || 0,
      attributes: parsedAttributes,
      price: { amount: Number(priceAmount), currency: priceCurrency || "INR" },
    });
    await product.save();

    return res.status(201).json({ message: "Variant added successfully", success: true, product });
  } catch (error) {
    console.error("Add variant error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { priceAmount, priceCurrency, stock, attributes } = req.body;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (req.files && req.files.length > 0) {
      const urls = await Promise.all(
        req.files.map((file) =>
          uploadFile({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype })
        )
      );
      variant.images = urls.map((url) => ({ url }));
    }

    if (priceAmount) variant.price.amount = Number(priceAmount);
    if (priceCurrency) variant.price.currency = priceCurrency;
    if (stock !== undefined) variant.stock = Number(stock);
    if (attributes) {
      try { variant.attributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes; } catch {}
    }

    await product.save();
    return res.status(200).json({ message: "Variant updated successfully", success: true, product });
  } catch (error) {
    console.error("Update variant error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateVariantStock = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { stock } = req.body;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }
    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    variant.stock = Number(stock);
    await product.save();
    return res.status(200).json({ message: "Variant stock updated", success: true, variant });
  } catch (error) {
    console.error("Update variant stock error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }
    product.variants = product.variants.filter((v) => v._id.toString() !== variantId);
    await product.save();
    return res.status(200).json({ message: "Variant deleted successfully", success: true, product });
  } catch (error) {
    console.error("Delete variant error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
