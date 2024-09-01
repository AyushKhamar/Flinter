import Product from "../models/product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, content: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error while getting all products",
    });
  }
};
