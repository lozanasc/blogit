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
exports.refreshToken = exports.signout = exports.signup = exports.login = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const models_1 = require("../models");
const login = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: true, message: errors.array()[0].msg });
    }
    const { email, password } = req.body;
    const foundUserByEmail = yield models_1.User.findOne({ where: { email } });
    if (!foundUserByEmail) {
        return res.status(400).send({ error: true, message: "No user with that email." });
    }
    const decryptPassword = yield (0, bcrypt_1.compare)(password, foundUserByEmail.password);
    if (!decryptPassword) {
        return res.status(400).send({ error: true, message: "Wrong password." });
    }
    const accessToken = (0, jsonwebtoken_1.sign)({
        userId: foundUserByEmail.id,
        role: foundUserByEmail.role,
    }, process.env.SECRET_TOKEN, { expiresIn: "1h" });
    const refreshToken = (0, jsonwebtoken_1.sign)({
        userId: foundUserByEmail.id,
        role: foundUserByEmail.role,
    }, process.env.REFRESH_TOKEN, { expiresIn: "1d" });
    yield models_1.Token.update({ refresh_token: refreshToken }, { where: { userId: foundUserByEmail.id }
    });
    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: process.env.APP_ENV !== "dev", maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).send({ error: false, message: `Welcome back, ${foundUserByEmail.first_name}!`, accessToken });
});
exports.login = login;
const signup = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    if (!image) {
        return res.status(400).send({ error: true, message: "Please provide a cover picture!" });
    }
    const profilePicture = image.filename;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: true, message: errors.array()[0].msg });
    }
    const { username, password, firstName, lastName, email, } = req.body;
    const salt = yield (0, bcrypt_1.genSalt)(10);
    const encryptedPassword = yield (0, bcrypt_1.hash)(password, salt);
    const isUserDuplicate = yield models_1.User.findOne({ where: { email } });
    if (isUserDuplicate) {
        return res.status(400).send({ error: true, message: "Sorry account already taken!" });
    }
    const newUser = yield models_1.User.create({
        username,
        password: encryptedPassword,
        first_name: firstName,
        last_name: lastName,
        email,
        password_chances: 3,
        role: "USER",
        profile_picture_url: profilePicture,
    });
    yield models_1.Token.create({
        userId: newUser.id,
    });
    if (!newUser) {
        return res.status(400).send({ error: true, message: "Registration failed, something went wrong!" });
    }
    return res.status(200).send({ error: false, message: `Welcome to blogit, ${firstName}!` });
});
exports.signup = signup;
const signout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cookies } = req;
    if (!cookies.jwt) {
        return res.status(403).send({ error: true, message: "Unauthorized, no token found!" });
    }
    const token = cookies.jwt;
    const isTokenValid = yield models_1.Token.findOne({ where: { refresh_token: token } });
    if (!isTokenValid) {
        return res.status(400).send({ error: true, message: "Please provide a valid user id!" });
    }
    if (!(isTokenValid === null || isTokenValid === void 0 ? void 0 : isTokenValid.refresh_token) === token) {
        res.clearCookie("jwt", { httpOnly: true });
        return res.status(400).send({ error: false, message: "Something went wrong!" });
    }
    const removeRefreshToken = yield models_1.Token.update({ refresh_token: null }, { where: { userId: isTokenValid === null || isTokenValid === void 0 ? void 0 : isTokenValid.userId } });
    if (removeRefreshToken) {
        res.clearCookie("jwt", { httpOnly: true });
        return res.status(200).send({ error: false, message: `See you later, ${isTokenValid === null || isTokenValid === void 0 ? void 0 : isTokenValid.userId}` });
    }
    return res.status(400).send({ error: true, message: "User not found!" });
});
exports.signout = signout;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cookies } = req;
    if (!cookies.jwt) {
        return res.status(401).send({ error: true, message: "No cookie found!" });
    }
    const refreshToken = cookies.jwt;
    const foundUserByRefreshToken = yield models_1.Token.findOne({ where: { refresh_token: refreshToken } });
    if (!foundUserByRefreshToken) {
        return res.status(403).send({ error: true, message: "No user with that token! " });
    }
    let decoded;
    try {
        const REFRESH_SECRET = process.env.REFRESH_TOKEN;
        const SECRET = process.env.SECRET_TOKEN;
        decoded = (0, jsonwebtoken_1.verify)(foundUserByRefreshToken.refresh_token, REFRESH_SECRET);
        const newAccessToken = (0, jsonwebtoken_1.sign)({
            userId: decoded.userId,
            role: decoded.role,
        }, SECRET, { expiresIn: "1h" });
        res.status(200).send({ error: false, message: "Refresh token is verified", accessToken: newAccessToken });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).send({ error: true, message: err.message });
        }
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map