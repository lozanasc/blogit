import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt, { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { User } from "../models/user.model";
import { Token } from "../models";

export const login = async(req: Request, res: Response, _next: NextFunction) => {
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  const foundUserByEmail = await User.findOne(email);

  if (!foundUserByEmail) {
    return res.status(400).send({ error: true, message: "No user with that email." });
  }

  const decryptPassword = await compare(password, foundUserByEmail.password);

  if (!decryptPassword) {
    return res.status(400).send({ error: true, message: "Wrong password." });
  }

  const accessToken = sign(
  { 
    username: foundUserByEmail.username,
    role: foundUserByEmail.role,
  },
  process.env.SECRET_TOKEN!,
  { expiresIn: "1h" });

  const refreshToken = sign(
    { username: foundUserByEmail.username },
    process.env.REFRESH_TOKEN!,
    { expiresIn: "1d" });

  await Token.update(
    { refreshToken }, 
    { where: { userId: foundUserByEmail.id } });

  res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: process.env.APP_ENV !== "dev", maxAge: 24 * 60 * 60 * 1000 });
  return res.status(200).send({ error: false, message: `Welcome back, ${foundUserByEmail.first_name}!`, accessToken });

}

export const signup = async(req: Request, res: Response, _next: NextFunction) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0] });
  }

  

}

export const signout = async(req: Request, res: Response, next: NextFunction) => {

  const { userId } = req.query;

  const { cookies } = req;
  
  if (!cookies.jwt) {
    return res.status(403).send({ error: true, message: "Unauthorized" });
  }

  const token = cookies.jwt;

  

}