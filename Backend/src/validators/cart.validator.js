import { check, param } from "express-validator";

export const addToCartValidation = [
  check("postId").notEmpty().withMessage("Post ID is required"),
  check("quantity").isNumeric().withMessage("Quantity must be a number").custom((value) => value > 0).withMessage("Quantity must be greater than 0"),
];

export const updateCartValidation = [
  param("postId").notEmpty().withMessage("Post ID is required in URL parameters"),
  check("quantity").isNumeric().withMessage("Quantity must be a number").custom((value) => value > 0).withMessage("Quantity must be greater than 0"),
];

export const removeFromCartValidation = [
  param("postId").notEmpty().withMessage("Post ID is required in URL parameters"),
];
