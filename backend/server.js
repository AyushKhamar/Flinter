import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route.js";
import { connectDb } from "./utils/connectDb.js";
import cookieParser from "cookie-parser";
import { productRouter } from "./routes/product.route.js";
import { cartRouter } from "./routes/cart.route.js";
import { couponRouter } from "./routes/coupon.route.js";
import { paymentRouter } from "./routes/payment.route.js";
import { analyticsRouter } from "./routes/analytics.route.js";
import path from "path";
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/analytics", analyticsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connectDb();
});
