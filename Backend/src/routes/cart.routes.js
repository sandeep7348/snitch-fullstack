import express from "express";
import {
  AddToCart,
  GetCart,
  RemoveFromCart,
  ClearCart,
  UpdateCartQuantity
} from "../controllers/cart.controller.js";
import {isAuthenticated as IdentifyUser} from "../controllers/auth.controller.js";
import { addToCartValidation, updateCartValidation, removeFromCartValidation } from "../validators/cart.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/add", IdentifyUser, addToCartValidation, validateRequest, AddToCart);

router.get("/", IdentifyUser, GetCart);


router.put("/update/:postId", IdentifyUser, updateCartValidation, validateRequest, UpdateCartQuantity);

router.delete("/remove/:postId", IdentifyUser, removeFromCartValidation, validateRequest, RemoveFromCart);

router.delete("/clear", IdentifyUser, ClearCart);

export default router;