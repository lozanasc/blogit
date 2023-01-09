"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRouter = exports.blogRouter = exports.userRouter = exports.authRouter = void 0;
const auth_routes_1 = __importDefault(require("./auth.routes"));
exports.authRouter = auth_routes_1.default;
const user_routes_1 = __importDefault(require("./user.routes"));
exports.userRouter = user_routes_1.default;
const blog_routes_1 = __importDefault(require("./blog.routes"));
exports.blogRouter = blog_routes_1.default;
const error_routes_1 = __importDefault(require("./error.routes"));
exports.errorRouter = error_routes_1.default;
//# sourceMappingURL=index.js.map