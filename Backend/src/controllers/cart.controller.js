import Cart from "../models/cart.models.js";
import Post from "../models/post.models.js";

export async function AddToCart(req, res) {
  try {
    const { postId, quantity } = req.body;
    const userId = req.user.id;

    if (!postId || !quantity) {
      return res.status(400).json({
        message: "Post ID and quantity are required",
      });
    }

    const qty = Number(quantity);

    if (qty <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (post.stock < qty) {
      return res.status(400).json({
        message: `Only ${post.stock} items available`,
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [
          {
            product: postId,
            quantity: qty,
          },
        ],
      });
    } else {
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === postId
      );

      if (existingProductIndex !== -1) {
        const newQuantity =
          cart.products[existingProductIndex].quantity + qty;

        if (newQuantity > post.stock) {
          return res.status(400).json({
            message: `Only ${post.stock} items available`,
          });
        }

        cart.products[existingProductIndex].quantity = newQuantity;
      } else {
        cart.products.push({
          product: postId,
          quantity: qty,
        });
      }
    }

    await cart.save();

    await cart.populate("products.product");

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function GetCart(req, res) {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      message: "Cart retrieved successfully",
      totalProducts: cart.products.length,
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function RemoveFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const productExists = cart.products.some(
      (item) => item.product.toString() === postId
    );

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== postId
    );

    await cart.save();

    await cart.populate("products.product");

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function ClearCart(req, res) {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.products = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}