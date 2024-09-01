import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controller/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.js";

export const productRouter = express.Router();

productRouter.get("/", protectRoute, adminRoute, getAllProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/recommendations", getRecommendedProducts);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.post("/", protectRoute, adminRoute, createProduct);
productRouter.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
productRouter.delete("/:id", protectRoute, adminRoute, deleteProduct);
