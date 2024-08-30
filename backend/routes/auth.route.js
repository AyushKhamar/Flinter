import express from "express";
import {
  loginController,
  logoutController,
  signupController,
} from "../controller/auth.controller.js";

export const authRouter = express.Router();

authRouter.get("/login", loginController);
authRouter.get("/signup", signupController);
authRouter.get("/logout", logoutController);
