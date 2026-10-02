import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getWishlist);
router.post("/toggle", verifyToken, toggleWishlist);

export default router;
