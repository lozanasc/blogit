"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const userRouter = (0, express_1.Router)();
userRouter.get('/profile', [middlewares_1.verifyJwt, (0, middlewares_1.verifyRole)("USER")], controllers_1.getProfile);
userRouter.patch('/profile', middlewares_1.validateProfileUpdate, [middlewares_1.verifyJwt, (0, middlewares_1.verifyRole)("USER")], controllers_1.updateProfile);
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map