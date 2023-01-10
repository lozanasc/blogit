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
exports.updateProfile = exports.getProfile = void 0;
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const utils_1 = require("../utils");
const getProfile = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser } = req;
    const foundUserById = yield models_1.User.findOne({
        where: { id: currentUser },
        attributes: {
            exclude: [
                "id",
                "password",
                "password_chances",
                "created_at",
                "updated_at",
                "deleted_at",
                "role",
            ]
        },
    });
    if (!foundUserById) {
        return res.status(500).send({ error: true, message: "Something went wrong!" });
    }
    return res.status(200).send({ error: false, message: "Fetching user profile", data: foundUserById });
});
exports.getProfile = getProfile;
const updateProfile = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser } = req;
    const image = req.file;
    if (!image) {
        return res.status(400).send({ error: true, message: "Please provide a cover picture!" });
    }
    const profilePicture = image.filename;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: true, message: errors.array()[0].msg });
    }
    const { first_name, last_name, username, email, password, } = req.body;
    const foundUserById = yield models_1.User.findOne({ where: { id: currentUser }, });
    let newPassword = foundUserById === null || foundUserById === void 0 ? void 0 : foundUserById.password;
    let updatePasswordChance = foundUserById === null || foundUserById === void 0 ? void 0 : foundUserById.password_chances;
    if (password) {
        if ((foundUserById === null || foundUserById === void 0 ? void 0 : foundUserById.password_chances) <= 0) {
            return res.status(400).send({ error: false, message: "Sorry you're out of password chances." });
        }
        const salt = yield (0, bcrypt_1.genSalt)(10);
        const encryptedPassword = yield (0, bcrypt_1.hash)(password, salt);
        updatePasswordChance = (foundUserById === null || foundUserById === void 0 ? void 0 : foundUserById.password_chances) - 1;
        newPassword = encryptedPassword;
    }
    if (profilePicture) {
        // Removes user's current profile image in the server
        (0, utils_1.updateImage)(foundUserById === null || foundUserById === void 0 ? void 0 : foundUserById.profile_picture_url);
    }
    const updateUserProfile = yield models_1.User.update({
        first_name,
        last_name,
        username,
        email,
        profile_picture_url: profilePicture,
        password: newPassword,
        password_chances: updatePasswordChance,
    }, { where: { id: currentUser } });
    if (!updateUserProfile) {
        return res.status(500).send({ error: true, message: "Something went wrong, user update failed!" });
    }
    return res.status(200).send({ error: true, message: "Update success!" });
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=user.controller.js.map