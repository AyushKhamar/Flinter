import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      return res
        .status(401)
        .json({ success: false, message: "No access token provided" });
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Access token is invalid" });
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in protect Route controller" });
  }
};
export const adminRoute = (req, res, next) => {
  const user = req.user;
  if (!user)
    return res.status(401).json({ success: false, message: "User not found" });
  if (user.role !== "admin")
    return res
      .status(403)
      .json({ success: false, message: "User is not admin" });
  next();
};
