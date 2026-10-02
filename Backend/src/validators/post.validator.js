import { check, query } from "express-validator";

export const createPostValidation = [
  check("title").notEmpty().withMessage("Title is required").trim(),
  check("description").notEmpty().withMessage("Description is required").trim(),
  check("category").notEmpty().withMessage("Category is required").trim(),
  check("price").isNumeric().withMessage("Price must be a number"),
  check("stock").isNumeric().withMessage("Stock must be a number"),
];

export const searchValidation = [
  check("query").notEmpty().withMessage("Search query is required").trim(),
];

export const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
];
