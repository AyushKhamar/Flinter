import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controller/cart.controller.js";

export const cartRouter = express.Router();

cartRouter.post("/", protectRoute, addToCart);
cartRouter.delete("/", protectRoute, removeAllFromCart);
cartRouter.put("/:id", protectRoute, updateQuantity);
cartRouter.get("/", protectRoute, getCartProducts);
