import { Router } from "express";

import { 
  getBlogs,
  getUserBlogs,
  getBlogById,
  postUserBlog,
  editUserBlog,
  deleteUserBlog,
} from "../controllers";

import { 
  validateBlogUpdate,
  validateUpload,
  verifyJwt,
  skipVerifyJwt,
 } from "../middlewares";

const blogRouter: Router = Router();

blogRouter.get("/blogs", getBlogs);

blogRouter.get("/blogs/user", skipVerifyJwt, verifyJwt, getUserBlogs);

blogRouter.get("/blog/:id", skipVerifyJwt, verifyJwt, getBlogById);

blogRouter.post("/blog", verifyJwt, validateUpload, postUserBlog);

blogRouter.patch("/blog/:id", verifyJwt, validateBlogUpdate, editUserBlog);

blogRouter.delete("/blog/:id", verifyJwt, deleteUserBlog);

export default blogRouter;