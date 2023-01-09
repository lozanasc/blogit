"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorage = void 0;
const crypto_1 = require("crypto");
const multer_1 = __importDefault(require("multer"));
exports.fileStorage = multer_1.default.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "./storage/");
    },
    filename: (request, file, callback) => {
        callback(null, `${(0, crypto_1.randomBytes)(5).toString("hex")}_${file.originalname.replace(/\s/g, "")}`);
    }
});
//# sourceMappingURL=multer.js.map