import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route.js";
import { connectDb } from "./utils/connectDb.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  connectDb();
});
