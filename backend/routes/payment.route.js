import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controller/payment.controller.js";

export const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  protectRoute,
  createCheckoutSession
);
paymentRouter.post("/checkout-success", protectRoute, checkoutSuccess);
