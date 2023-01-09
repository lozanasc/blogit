import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { Blog } from "../models";
import { paginate, updateImage } from "../utils";

export const getBlogs = async(req: Request, res: Response, _next: NextFunction) => {

  const { q, page, limit, order_by, order_direction } = req.query;
  
  let search: any = { 
    where: { is_draft: false, },
  };

  let order: any = [];

  if (q) {
    search.where = { ...search.where, title: { [Op.like]: `%${q}` } };
  }

  if (order_by && order_direction) {
    order.push([order_by, order_direction]);
  }

  const allBlogs = await paginate(Blog, Number(page), Number(limit), search, order, null);

  return res.status(200).send({ error: false, message: "Fetched public blogs", data: allBlogs });
}

export const getUserBlogs = async(req: Request, res: Response, _next: NextFunction) => {
  
  const { currentUser } = req;

  const { id } = req.query;

  const { q, page, limit, order_by, order_direction } = req.query;
  
  let search: any = { where: { is_draft: false, }, };

  let order: any = [];
  
  if (!req.skip) {
    const limitPublic = id && search.where;

    // Will include soft-deleted records
    search = { ...search, paranoid: false }

    search.where = {
      ...limitPublic,
      userId: id || currentUser,
    }
  }

  if (req.skip && !id) {
    return res.status(200).send({ error: false, message: "No blogs found, please provide user's id.", });
  }
  
  if (req.skip) {
    search.where = {
      ...search.where,
      userId: id,
    }
  }


  if (q) {
    search.where = { ...search.where, title: { [Op.like]: `%${q}` } };
  }

  if (order_by && order_direction) {
    order.push([order_by, order_direction]);
  }

  const allBlogs = await paginate(Blog, Number(page), Number(limit), search, order, null);


  return res.status(200).send({ error: false, message: "Fetched user blogs", data: allBlogs });
}

export const getBlogById = async(req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;

  let defaultOptions = {
    where: {
      id,
      is_draft: false,
    }
  }

  let allowDraftOptions = {
    where: {
      id,
    },
    paranoid: false,
  }

  const options = req.skip ? defaultOptions : allowDraftOptions;

  const foundBlogById = await Blog.findOne(options);

  if (!foundBlogById) {
    return res.status(404).send({ error: true, message: "Blog not found!" });
  }

  return res.status(200).send({ error: false, message: "Fetch blog by id", data: foundBlogById });
}

export const postUserBlog = async(req: Request, res: Response, _next: NextFunction) => {

  const image = req.file;

  if (!image) {
    return res.status(400).send({ error: true, message: "Please provide a cover picture!" });
  }

  const coverPhoto = image.filename;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0].msg });
  }

  const { currentUser } = req;

  const {
    title,
    description,
    isDraft,
  } = req.body;
  
  const postBlog = await Blog.create({
    title,
    description,
    cover_picture_url: coverPhoto,
    is_draft: isDraft,
    userId: currentUser,
  });

  if (!postBlog) {
    return res.status(400).send({ error: true, message: "Something went wrong, upload failed!" });
  }

  return res.status(200).send({ error: false, message: "Upload success!" });
}

export const editUserBlog = async(req: Request, res: Response, _next: NextFunction) => {

  const { currentUser } = req;

  const { id } = req.params;

  const image = req.file;

  const coverPhoto = image?.filename;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0].msg });
  }

  const {
    title,
    description,
    isDraft,
  } = req.body;

  const isBlogIdValid = await Blog.findOne({ where: { userId: currentUser, id }, });

  if (!isBlogIdValid) {
    return res.status(400).send({ error: true, message: "Please provide a valid blog id, update failed!" });
  }

  if (coverPhoto) {
     // Removes user's current profile image in the server
     updateImage(isBlogIdValid?.cover_picture_url!);
  }

  const postBlog = await Blog.update(
    { 
      title,
      description,
      cover_picture_url: coverPhoto,
      is_draft: isDraft,
    },
    { where: { userId: currentUser, id }});

  if (!postBlog) {
    return res.status(400).send({ error: true, message: "Something went wrong, update failed!" });
  }

  return res.status(200).send({ error: false, message: "Update success!" });
}

export const deleteUserBlog = async(req: Request, res: Response, _next: NextFunction) => {
  const { currentUser } = req;
  
  const { id } = req.params;

  const isBlogIdValid = await Blog.findOne({ where: { userId: currentUser, id }, });

  if (!isBlogIdValid) {
    return res.status(400).send({ error: true, message: "Please provide a valid blog id, deletion failed!" });
  }

  const deleteBlog = await Blog.destroy({ where: { userId: currentUser, id }});

  if (!deleteBlog) {
    return res.status(400).send({ error: true, message: "Something went wrong, deletion failed!" });
  }

  return res.status(200).send({ error: false, message: "Blog deleted!" });
}
