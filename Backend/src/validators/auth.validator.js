import { check } from "express-validator";

export const registerValidation = [
  check("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  check("contact").matches(/^\d{10}$/).withMessage("Contact must be a 10-digit phone number"),
  check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  check("fullName").isLength({ min: 3 }).withMessage("fullName must be at least 3 characters").trim(),
];

export const loginValidation = [
  check("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  check("password").notEmpty().withMessage("Password is required"),
];
