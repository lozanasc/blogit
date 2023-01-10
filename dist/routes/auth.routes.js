"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const authRouter = (0, express_1.Router)();
authRouter.post("/login", middlewares_1.validateLogin, controllers_1.login);
authRouter.post("/signup", middlewares_1.validateSignup, controllers_1.signup);
authRouter.get("/signout", controllers_1.signout);
authRouter.get("/refresh", controllers_1.refreshToken);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map