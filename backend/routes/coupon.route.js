import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getCoupon, validateCoupon } from "../controller/coupon.controller.js";

export const couponRouter = express.Router();

couponRouter.get("/", protectRoute, getCoupon);
couponRouter.post("/validate", protectRoute, validateCoupon);
