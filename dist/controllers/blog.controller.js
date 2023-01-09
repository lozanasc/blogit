"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserBlog = exports.editUserBlog = exports.postUserBlog = exports.getBlogById = exports.getUserBlogs = exports.getBlogs = void 0;
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const utils_1 = require("../utils");
const getBlogs = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { q, page, limit, order_by, order_direction } = req.query;
    let search = {
        where: { is_draft: false, },
    };
    let order = [];
    if (q) {
        search.where = Object.assign(Object.assign({}, search.where), { title: { [sequelize_1.Op.like]: `%${q}` } });
    }
    if (order_by && order_direction) {
        order.push([order_by, order_direction]);
    }
    const allBlogs = yield (0, utils_1.paginate)(models_1.Blog, Number(page), Number(limit), search, order, null);
    return res.status(200).send({ error: false, message: "Fetched public blogs", data: allBlogs });
});
exports.getBlogs = getBlogs;
const getUserBlogs = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser } = req;
    const { id } = req.query;
    const { q, page, limit, order_by, order_direction } = req.query;
    let search = { where: { is_draft: false, }, };
    let order = [];
    if (!req.skip) {
        const limitPublic = id && search.where;
        // Will include soft-deleted records
        search = Object.assign(Object.assign({}, search), { paranoid: false });
        search.where = Object.assign(Object.assign({}, limitPublic), { userId: id || currentUser });
    }
    if (req.skip && !id) {
        return res.status(200).send({ error: false, message: "No blogs found, please provide user's id.", });
    }
    if (req.skip) {
        search.where = Object.assign(Object.assign({}, search.where), { userId: id });
    }
    if (q) {
        search.where = Object.assign(Object.assign({}, search.where), { title: { [sequelize_1.Op.like]: `%${q}` } });
    }
    if (order_by && order_direction) {
        order.push([order_by, order_direction]);
    }
    const allBlogs = yield (0, utils_1.paginate)(models_1.Blog, Number(page), Number(limit), search, order, null);
    return res.status(200).send({ error: false, message: "Fetched user blogs", data: allBlogs });
});
exports.getUserBlogs = getUserBlogs;
const getBlogById = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let defaultOptions = {
        where: {
            id,
            is_draft: false,
        }
    };
    let allowDraftOptions = {
        where: {
            id,
        },
        paranoid: false,
    };
    const options = req.skip ? defaultOptions : allowDraftOptions;
    const foundBlogById = yield models_1.Blog.findOne(options);
    if (!foundBlogById) {
        return res.status(404).send({ error: true, message: "Blog not found!" });
    }
    return res.status(200).send({ error: false, message: "Fetch blog by id", data: foundBlogById });
});
exports.getBlogById = getBlogById;
const postUserBlog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    if (!image) {
        return res.status(400).send({ error: true, message: "Please provide a cover picture!" });
    }
    const coverPhoto = image.filename;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: true, message: errors.array()[0].msg });
    }
    const { currentUser } = req;
    const { title, description, isDraft, } = req.body;
    const postBlog = yield models_1.Blog.create({
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
});
exports.postUserBlog = postUserBlog;
const editUserBlog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser } = req;
    const { id } = req.params;
    const image = req.file;
    const coverPhoto = image === null || image === void 0 ? void 0 : image.filename;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: true, message: errors.array()[0].msg });
    }
    const { title, description, isDraft, } = req.body;
    const isBlogIdValid = yield models_1.Blog.findOne({ where: { userId: currentUser, id }, });
    if (!isBlogIdValid) {
        return res.status(400).send({ error: true, message: "Please provide a valid blog id, update failed!" });
    }
    if (coverPhoto) {
        // Removes user's current profile image in the server
        (0, utils_1.updateImage)(isBlogIdValid === null || isBlogIdValid === void 0 ? void 0 : isBlogIdValid.cover_picture_url);
    }
    const postBlog = yield models_1.Blog.update({
        title,
        description,
        cover_picture_url: coverPhoto,
        is_draft: isDraft,
    }, { where: { userId: currentUser, id } });
    if (!postBlog) {
        return res.status(400).send({ error: true, message: "Something went wrong, update failed!" });
    }
    return res.status(200).send({ error: false, message: "Update success!" });
});
exports.editUserBlog = editUserBlog;
const deleteUserBlog = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser } = req;
    const { id } = req.params;
    const isBlogIdValid = yield models_1.Blog.findOne({ where: { userId: currentUser, id }, });
    if (!isBlogIdValid) {
        return res.status(400).send({ error: true, message: "Please provide a valid blog id, deletion failed!" });
    }
    const deleteBlog = yield models_1.Blog.destroy({ where: { userId: currentUser, id } });
    if (!deleteBlog) {
        return res.status(400).send({ error: true, message: "Something went wrong, deletion failed!" });
    }
    return res.status(200).send({ error: false, message: "Blog deleted!" });
});
exports.deleteUserBlog = deleteUserBlog;
//# sourceMappingURL=blog.controller.js.map