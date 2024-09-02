import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { redisClient } from "../utils/redis.js";
import bcrypt from "bcryptjs";
const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
const storeRefreshToken = async (userId, refreshToken) => {
  await redisClient.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookie = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
export const signupController = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    const user = await User.create({ email, password, username });
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, accessToken, refreshToken);
    return res.status(200).json({
      success: true,
      message: "Signup successfull",
      content: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email or password is not there" });

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookie(res, accessToken, refreshToken);
      res.status(200).json({
        success: true,
        message: "Login successfull",
        content: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Some error in login controller" });
  }
};
export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "No token exists" });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    redisClient.del(`refresh_token:${decoded.userId}`);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in logout controller" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "No token exists" });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await redisClient.get(
      `refresh_token:${decoded.userId}`
    );
    if (storedToken !== refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "The token is not correct" });
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Access token successfully replenished",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in refresh token controller" });
  }
};
export const getProfile = (req, res) => {
  try {
    res.status(200).json({ success: true, content: req.user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in getting profile" });
  }
};
