import express from "express";
import { login, register, isAuthenticated, getUserDetails, logOut, updateUserProfile } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation, updateProfileValidation } from "../validators/auth.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/login", loginValidation, validateRequest, login);
router.post("/register", registerValidation, validateRequest, register);
router.get("/getMe", isAuthenticated, getUserDetails);
router.put("/updateMe", isAuthenticated, updateProfileValidation, validateRequest, updateUserProfile);
router.get("/logout", logOut);

export default router;
