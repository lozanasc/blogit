import { Request, Response, NextFunction } from "express";

// Returns all blogs that have gone public
export const getPublicBlogs = async(req: Request, res: Response, _next: NextFunction) => {

}

// Returns blogs with higher views that usual
export const getFeaturedBlogs = async(req: Request, res: Response, _next: NextFunction) => {
  
}

// Returns single blog using blog id
export const retrieveBlog = async(req: Request, res: Response, _next: NextFunction) => {

}

// Returns specific user blogs
export const retrieveUserBlogs = async(req: Request, res: Response, _next: NextFunction) => {
  // State of the blog can be controlled by a query parameter called state

}

// Uploads blog to the database
export const postUserBlog = async(req: Request, res: Response, _next: NextFunction) => {

}

// Updates blog to the database
export const editUserBlog = async(req: Request, res: Response, _next: NextFunction) => {

}

// Deletes blog to the database
export const deleteUserBlog = async(req: Request, res: Response, _next: NextFunction) => {

}
