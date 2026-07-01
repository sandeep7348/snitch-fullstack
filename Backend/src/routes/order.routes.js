import express from "express";
import {
  PlaceOrder,
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controller.js";
import { isAuthenticated as IdentifyUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", IdentifyUser, PlaceOrder);

router.get("/", IdentifyUser, getOrders);

router.get("/:id", IdentifyUser, getOrderById);

router.put("/cancel/:id", IdentifyUser, cancelOrder);

export default router;