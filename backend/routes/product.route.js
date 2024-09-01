import express from "express";
import { getAllProducts } from "../controller/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.js";

export const productRouter = express.Router();

productRouter.get("/", protectRoute, adminRoute, getAllProducts);
