import { Product } from "../models/product.js";
import cloudinary from "../utils/cloudinary.js";
import { redisClient } from "../utils/redis.js";

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

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await redisClient.get("featured_products");
    if (products)
      return res
        .status(200)
        .json({ success: true, content: JSON.parse(products) });
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts)
      return res
        .status(404)
        .json({ success: false, message: "No featured products found" });
    redisClient.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(200).json({ success: true, content: featuredProducts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error in getting featured products",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    });
    return res.status(200).json({ success: true, content: product });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Some error in create product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log(
          "error while deleting product from cloudinary",
          error.message
        );
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error while deleting the product",
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
    ]);
    res.status(200).json({ success: true, content: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error while getting recommended products",
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json({ success: true, content: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error in get productsby category",
    });
  }
};

export const updateFeaturedProductsCache = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redisClient.set(
      "featured_products",
      JSON.stringify(featuredProducts)
    );
  } catch (error) {
    console.log("Error while updating featured products");
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "No such product found" });
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();
    res.status(200).json({ success: true, content: updatedProduct });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error in toggling featured product",
    });
  }
};
