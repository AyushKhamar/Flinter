import express from "express";
import {
  getProfile,
  loginController,
  logoutController,
  refreshToken,
  signupController,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);
authRouter.post("/logout", logoutController);
authRouter.post("/refreshToken", refreshToken);
authRouter.get("/profile", protectRoute, getProfile);
