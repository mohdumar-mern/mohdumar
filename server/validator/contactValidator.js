// validators/contactValidator.js
import { body } from "express-validator";

export const contactFormValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2 to 50 characters long"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\+?[0-9]{7,15}$/).withMessage("Please enter a valid phone number"),

  body("message")
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 10, max: 500 }).withMessage("Message must be 10 to 500 characters long"),
];
