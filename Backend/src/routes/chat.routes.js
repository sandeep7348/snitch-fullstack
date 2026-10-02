import express from "express";
import { chat } from "../controllers/chat.controller.js";
import { chatValidation } from "../validators/chat.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

// POST /api/chat
router.post("/chat", chatValidation, validateRequest, chat);

export default router;
