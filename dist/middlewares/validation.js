"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileUpdate = exports.validateBlogUpdate = exports.validateUpload = exports.validateLogin = exports.validateSignup = void 0;
const express_validator_1 = require("express-validator");
exports.validateSignup = [
    (0, express_validator_1.check)("username", "Username must be atleast 3+ characters long")
        .notEmpty()
        .isLength({ min: 3 }),
    (0, express_validator_1.check)("email", "Email is not valid")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .normalizeEmail(),
    (0, express_validator_1.check)("password", "Password is required")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8+ characters long")
        .matches(/(?=.*[!@#$%^&*])/)
        .withMessage("Password must have atleast 1 special character")
        .matches(/(?=.*[0-9])/)
        .withMessage("Password must have atleast 1 numeric character"),
    (0, express_validator_1.check)("firstName", "Your first name is required")
        .notEmpty()
        .isString()
        .withMessage("Invalid type as firstName"),
    (0, express_validator_1.check)("lastName", "Your last name is required")
        .notEmpty()
        .isString()
        .withMessage("Invalid type as lastName"),
];
exports.validateLogin = [
    (0, express_validator_1.check)("email", "Email is required!")
        .notEmpty()
        .isEmail()
        .withMessage("Email is invalid!"),
    (0, express_validator_1.check)("password", "Password is required!")
        .notEmpty()
];
exports.validateUpload = [
    (0, express_validator_1.check)("title", "Title is required")
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2+ characters long"),
    (0, express_validator_1.check)("description", "Description is required")
        .notEmpty()
        .isLength({ min: 50 })
        .withMessage("Your blog must be at least 50+ characters long"),
    (0, express_validator_1.check)("isDraft", "an updated draft state value is required")
        .optional()
        .notEmpty()
        .isBoolean()
        .withMessage("Invalid isDraft value"),
];
exports.validateBlogUpdate = [
    (0, express_validator_1.check)("title", "Title is required")
        .optional()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2+ characters long"),
    (0, express_validator_1.check)("description", "Description is required")
        .optional()
        .notEmpty()
        .isLength({ min: 50 })
        .withMessage("Your blog must be at least 50+ characters long"),
    (0, express_validator_1.check)("isDraft", "an updated draft state value is required")
        .optional()
        .notEmpty()
        .isBoolean()
        .withMessage("Invalid isDraft value"),
];
exports.validateProfileUpdate = [
    (0, express_validator_1.check)("email")
        .optional()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email"),
    (0, express_validator_1.check)("password")
        .optional()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8+ characters long")
        .matches(/(?=.*[!@#$%^&*])/)
        .withMessage("Password must have atleast 1 special character")
        .matches(/(?=.*[0-9])/)
        .withMessage("Password must have atleast 1 numeric character"),
    (0, express_validator_1.check)("firstName")
        .optional()
        .notEmpty()
        .notEmpty()
        .isString()
        .withMessage("Invalid type as firstName"),
    (0, express_validator_1.check)("lastName")
        .optional()
        .notEmpty()
        .isString()
        .withMessage("Invalid type as lastName"),
];
//# sourceMappingURL=validation.js.map