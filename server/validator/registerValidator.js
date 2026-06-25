import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2 to 50 characters long"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),


    
];
