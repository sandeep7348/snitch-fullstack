import express from "express";
import { login, register,isAuthenticated ,getUserDetails,logOut} from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);
router.get("/getMe",isAuthenticated,getUserDetails);
router.get("/logout",logOut)

export default router;
