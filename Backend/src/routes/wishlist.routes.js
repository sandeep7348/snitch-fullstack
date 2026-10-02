import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";
import { isAuthenticated as IdentifyUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", IdentifyUser, getWishlist);
router.post("/toggle", IdentifyUser, toggleWishlist);

export default router;
