import { check } from "express-validator";

export const validateSignup = [

  check("username", "Username must be atleast 3+ characters long")
    .notEmpty()
    .isLength({ min: 3 }),
 
  check("email", "Email is not valid")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .normalizeEmail(),

  check("password", "Password is required")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8+ characters long")
    .matches(/(?=.*[!@#$%^&*])/)
    .withMessage("Password must have atleast 1 special character")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password must have atleast 1 numeric character"),

  check("firstName", "Your first name is required")
    .notEmpty()
    .isString()
    .withMessage("Invalid type as firstName"),

  check("lastName", "Your last name is required")
    .notEmpty()
    .isString()
    .withMessage("Invalid type as lastName"),
    
];

export const validateLogin = [

  check("email", "Email is required!")
    .notEmpty()
    .isEmail()
    .withMessage("Email is invalid!"),

  check("password", "Password is required!")
    .notEmpty()

];

export const validateUpload = [

  check("title", "Title is required")
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2+ characters long"),
    
  check("description", "Description is required")
    .notEmpty()
    .isLength({ min: 50 })
    .withMessage("Your blog must be at least 50+ characters long"),

  check("isDraft", "an updated draft state value is required")
    .optional()
    .notEmpty()
    .isBoolean()
    .withMessage("Invalid isDraft value"),

];

export const validateBlogUpdate = [

  check("title", "Title is required")
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Title must be at least 2+ characters long")
    .optional(),
    
  check("description", "Description is required")
    .notEmpty()
    .withMessage("Your blog must be at least 50+ characters long")
    .optional(),

  check("isDraft", "an updated draft state value is required")
    .notEmpty()
    .isBoolean()
    .withMessage("Invalid isDraft value")
    .optional(),


    check("unarchive", "an updated unarchive state value is required")
    .notEmpty()
    .isBoolean()
    .withMessage("Invalid unarchive value")
    .optional(),

];

export const validateProfileUpdate = [

  check("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email"),

  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8+ characters long")
    .matches(/(?=.*[!@#$%^&*])/)
    .withMessage("Password must have atleast 1 special character")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password must have atleast 1 numeric character"),

  check("firstName")
    .optional()
    .isString()
    .withMessage("Invalid type as firstName"),

  check("lastName")
    .optional()
    .isString()
    .withMessage("Invalid type as lastName"),

];