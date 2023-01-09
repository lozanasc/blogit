"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errorRouter = (0, express_1.Router)();
errorRouter.use(controllers_1.notFound);
exports.default = errorRouter;
//# sourceMappingURL=error.routes.js.map