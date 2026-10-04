import express from "express";
import { chat } from "../controllers/chat.controller.js";
import { chatValidation } from "../validators/chat.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { optionalAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/chat (Accessible to guests and logged-in users)
router.post("/chat", optionalAuth, chatValidation, validateRequest, chat);

export default router;
