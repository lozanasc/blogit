import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { unlinkSync } from "fs";
import { Op } from "sequelize";
import { Blog, User } from "../models";
import { paginate, uploadImage } from "../utils";

export const getBlogs = async(req: Request, res: Response, _next: NextFunction) => {
  const { q, page, limit, order_by, order_direction } = req.query;

  let search: any = { 
    where: { is_draft: false, },
  };

  let order: any = [];

  if (q) {
    search.where = { ...search.where, title: { [Op.iLike]: `%${q}%` } };
  }

  if (order_by && order_direction) {
    order.push([order_by, order_direction]);
  }

  const transform = (records: Blog[]) => {
    return records.map(record => {
        return {
            id: record.id,
            title: record.title,
            description: record.description,
            created_at: record.created_at,
            cover_picture_url: record.cover_picture_url,
            author: `${record.user.first_name} ${record.user.last_name}`,
            author_profile: record.user.profile_picture_url,
        }
    });
  }

  const allBlogs = await paginate(Blog, Number(page), Number(limit), search, order, transform);

  return res.status(200).send({ error: false, message: "Fetched public blogs", data: allBlogs });
}

export const getUserBlogs = async(req: Request, res: Response, _next: NextFunction) => {
  const { currentUser } = req;

  const { id } = req.query;

  const { q, page, limit, order_by, order_direction, filter } = req.query;
  
  let search: any = { where: { is_draft: false, }, };

  let order: any = [];
  
  console.log(req.skip)

  if (!req.skip) {
    const limitPublic = id && search.where;

    // base authorized user
    // Disabling paranoid will include soft-deleted records
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
      is_draft: false,
      userId: id,
    }
  }

  if (filter && currentUser) {
    if (filter === "active") {
      search = {
        where: {
          is_draft: false,
          userId: id || currentUser,
        },
        paranoid: true,
      }
    } 

    if (filter === "draft") {
      search = {
        where: {
          is_draft: true,
          userId: id || currentUser,
        },
        paranoid: true,
      }
    }

    if (filter === "archived") {
      search = {
        where: {
          deleted_at: { [Op.not]: null },
          userId: id || currentUser,
        },
        paranoid: false,
      }
    }
  }


  if (q) {
    search.where = { ...search.where, title: { [Op.like]: `%${q}` } };
  }

  if (order_by && order_direction) {
    order.push([order_by, order_direction]);
  }

  let transform = (records: Blog[]) => {
    return records.map(record => {
        return {
            id: record.id,
            title: record.title,
            description: record.description,
            created_at: record.created_at,
            deleted_at: record.deleted_at,
            cover_picture_url: record.cover_picture_url,
            author: `${record.user.first_name} ${record.user.last_name}`,
            author_profile: record.user.profile_picture_url,
        }
    });
  }

  const allBlogs = await paginate(Blog, Number(page), Number(limit), search, order, transform);


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
  
  const foundBlogById = await Blog.findOne({ ...options, include: User });
  
  if (!foundBlogById) {
    return res.status(404).send({ error: true, message: "Blog not found!" });
  }
  
  if (req.currentUser !== foundBlogById.userId) {
    console.log(req.currentUser);
    console.log(foundBlogById.userId);
    let updatedViews = foundBlogById.views! + 1;
    await Blog.update(
      {
        views: updatedViews,
      },
      { where: { id } }
      );
  }

  const transformData = {
    id: foundBlogById.id,
    title: foundBlogById.title,
    description: foundBlogById.description,
    created_at: foundBlogById.created_at,
    deleted_at: foundBlogById.deleted_at,
    cover_picture_url: foundBlogById.cover_picture_url,
    isDraft: foundBlogById.is_draft,
    userId: foundBlogById.userId,
    author: `${foundBlogById.user.first_name} ${foundBlogById.user.last_name}`,
    author_profile: foundBlogById.user.profile_picture_url,
  }

  return res.status(200).send({ 
    error: false, 
    message: "Fetch blog by id", 
    data: transformData,
  });
}

export const postUserBlog = async(req: Request, res: Response, _next: NextFunction) => {
  const image = req.file;
  
  if (!image) {
    return res.status(400).send({ error: true, message: "Please provide a cover picture!" });
  }

  const result = await uploadImage(image);
  // Removes image from server's filesystem
  unlinkSync(image.path);

  const coverPhoto = `/storage/${result.Key}`;

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

  console.log("This is the body = ", req.body);

  const { id } = req.params;

  const image = req.file!;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0].msg });
  }

  const {
    title,
    description,
    isDraft,
    unarchive,
  } = req.body;

  const finyBlogById = await Blog.findOne({ where: { userId: currentUser, id }, paranoid: false });

  let result;

  if (image) {
    result = await uploadImage(image);
    // Removes image from server's filesystem
    unlinkSync(image.path);
  }

  const coverPhoto = result ? `/storage/${result?.Key}` : finyBlogById?.cover_picture_url;

  if (!finyBlogById) {
    return res.status(400).send({ error: true, message: "Please provide a valid blog id, update failed!" });
  }

  if (unarchive === "true") {
    finyBlogById.restore();
    return res.status(400).send({ error: false, message: "Blog restored!" });
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
