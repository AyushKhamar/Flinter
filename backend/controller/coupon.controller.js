import Coupon from "../models/coupon.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.status(200).json({ success: true, content: coupon });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Some error while getting coupons" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "No coupon found" });
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      coupon.save();
      return res
        .status(404)
        .json({ success: false, message: "Coupon expired" });
    }
    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in validate coupon controller" });
  }
};
