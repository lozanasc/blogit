import { Request, Response, NextFunction } from "express";
import { genSalt, hash } from "bcrypt";
import { validationResult } from "express-validator";
import { User } from "../models";
import { updateImage } from "../utils";

export const getProfile = async(req: Request, res: Response, _next: NextFunction) => {
  const { currentUser } = req;

  const foundUserById = await User.findOne({
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

  if (!image) {
    return res.status(400).send({ error: true, message: "Please provide a cover picture!" });
  }

  const profilePicture = image.filename;

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

  let newPassword: string = foundUserById?.password!;

  let updatePasswordChance = foundUserById?.password_chances;

  if (password) {
    
    if (foundUserById?.password_chances! <= 0) {
      return res.status(400).send({ error: false, message: "Sorry you're out of password chances." });
    }

    const salt = await genSalt(10);
    
    const encryptedPassword = await hash(password, salt);

    updatePasswordChance = foundUserById?.password_chances! - 1;

    newPassword = encryptedPassword;

  }

  if (profilePicture) {
    // Removes user's current profile image in the server
    updateImage(foundUserById?.profile_picture_url!);
  }

  const updateUserProfile = await User.update({
    first_name,
    last_name,
    username,
    email,
    profile_picture_url: profilePicture,
    password: newPassword,
    password_chances: updatePasswordChance,
  },
  { where: { id: currentUser }});

  if (!updateUserProfile) {
    return res.status(500).send({ error: true, message: "Something went wrong, user update failed!" });
  }

  return res.status(200).send({ error: true, message: "Update success!" });
}