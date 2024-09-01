import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route.js";
import { connectDb } from "./utils/connectDb.js";
import cookieParser from "cookie-parser";
import { productRouter } from "./routes/product.route.js";
import { cartRouter } from "./routes/cart.route.js";
import { couponRouter } from "./routes/coupon.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connectDb();
});
