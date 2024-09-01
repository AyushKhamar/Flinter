import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Db connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
