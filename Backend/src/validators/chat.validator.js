import { check } from "express-validator";

export const chatValidation = [
  check("messages").isArray({ min: 1 }).withMessage("Messages must be an array with at least one message"),
  check("messages.*.role").isIn(["user", "assistant"]).withMessage("Message role must be either 'user' or 'assistant'"),
  check("messages.*.content").notEmpty().withMessage("Message content cannot be empty"),
];
