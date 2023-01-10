"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const blogRouter = (0, express_1.Router)();
// Public
blogRouter.get("/blogs", controllers_1.getBlogs);
blogRouter.get("/blogs/user", middlewares_1.skipVerifyJwt, middlewares_1.verifyJwt, controllers_1.getUserBlogs);
blogRouter.get("/blog/:id", middlewares_1.skipVerifyJwt, middlewares_1.verifyJwt, controllers_1.getBlogById);
blogRouter.post("/blog", middlewares_1.verifyJwt, middlewares_1.validateUpload, controllers_1.postUserBlog);
blogRouter.patch("/blog/:id", middlewares_1.verifyJwt, middlewares_1.validateBlogUpdate, controllers_1.editUserBlog);
blogRouter.delete("/blog/:id", middlewares_1.verifyJwt, controllers_1.deleteUserBlog);
exports.default = blogRouter;
//# sourceMappingURL=blog.routes.js.map