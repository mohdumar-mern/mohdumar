import { body } from "express-validator";

export const loginValidator = [
 
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),


    
];
