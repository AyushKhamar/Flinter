import Product from "../models/product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) existingItem.quantity += 1;
    else user.cartItems.push(productId);
    await user.save();
    res.status(200).json({ success: true, content: user.cartItems });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Some error while adding to cart" });
  }
};
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) user.cartItems = [];
    else
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);

    await user.save();
    res.status(200).json({ success: true, content: user.cartItems });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Some error while adding to cart" });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === id);
    if (existingItem) {
      if (existingItem.quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== id);
        await user.save();
        return res.status(200).json({ success: true, content: user.cartItems });
      }
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json({ success: true, content: user.cartItems });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error in updating quantity of item " });
  }
};
export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;
    const products = await Product.find({ _id: { $in: user.cartItems } });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.status(200).json({ success: true, content: cartItems });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error while getting all the cart item",
    });
  }
};
