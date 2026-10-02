import User from "../models/user.models.js";
import Post from "../models/post.models.js";

// Toggle a post in the user's wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.indexOf(postId);
    if (index === -1) {
      user.wishlist.push(postId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();

    // Return populated wishlist
    const populatedUser = await User.findById(userId).populate("wishlist");
    return res.status(200).json({ wishlist: populatedUser.wishlist });
  } catch (error) {
    console.error("Error in toggleWishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get the user's populated wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in getWishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
