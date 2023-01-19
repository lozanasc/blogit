import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { unlinkSync } from "fs";
import md5 from "md5";

import { User } from "../models";
import { uploadImage } from "../utils";

export const getProfile = async(req: Request, res: Response, _next: NextFunction) => {
  const { currentUser } = req;

  const foundUserById = await User.findOne({
    where: { id: currentUser }, 
    attributes: {
    exclude: [
      "password_chances",
      "created_at",
      "updated_at",
      "deleted_at",
      "role",
      ]},
    });

  if (!foundUserById) {
    return res.status(500).send({ error: true, message: "Something went wrong!" });
  }

  return res.status(200).send({ error: false, message: "Fetching user profile", data: foundUserById });
}

export const updateProfile = async(req: Request, res: Response, _next: NextFunction) => { 
  const { currentUser } = req;

  const image = req.file;

  let result;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0].msg });
  }

  const {
    first_name,
    last_name,
    username,
    email,
    password,
  } = req.body;

  const foundUserById = await User.findOne({ where: { id: currentUser }, });

  if (image) {
    result = await uploadImage(image);
    // Removes image from server's filesystem
    unlinkSync(image.path);
  }

  const profilePicture = result ? `/storage/${result?.Key}` : foundUserById?.profile_picture_url;

  let toBeUpdatedPassword: string = foundUserById?.password!;

  let updatePasswordChance = foundUserById?.password_chances;

  if (password) {
    
    if (foundUserById?.password_chances! <= 0) {
      return res.status(400).send({ error: true, message: "Sorry you're out of password chances." });
    }

    let encryptedPassword = toBeUpdatedPassword;

    if (md5(password) !== toBeUpdatedPassword) {
      encryptedPassword = md5(password);

      updatePasswordChance = foundUserById?.password_chances! - 1;
    }
    
    toBeUpdatedPassword = encryptedPassword;
  }

  const updateUserProfile = await User.update({
    first_name,
    last_name,
    username,
    email,
    profile_picture_url: profilePicture,
    password: toBeUpdatedPassword,
    password_chances: updatePasswordChance,
  },
  { where: { id: currentUser }});

  if (!updateUserProfile) {
    return res.status(500).send({ error: true, message: "Something went wrong, user update failed!" });
  }

  return res.status(200).send({ error: false, message: "Update success!" });
}