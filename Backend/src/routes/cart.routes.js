import express from "express";
import {
  AddToCart,
  GetCart,
  RemoveFromCart,
  ClearCart,
} from "../controllers/cart.controller.js";
import {isAuthenticated as IdentifyUser} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/add", IdentifyUser, AddToCart);

router.get("/", IdentifyUser, GetCart);

router.delete("/remove/:postId", IdentifyUser, RemoveFromCart);

router.delete("/clear", IdentifyUser, ClearCart);

export default router;