import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { compare, genSalt, hash } from "bcrypt";
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken";

import { User, Token } from "../models";

export const login = async(req: Request, res: Response, _next: NextFunction) => {
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: true, message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  const foundUserByEmail = await User.findOne({ where: { email }});

  if (!foundUserByEmail) {
    return res.status(400).send({ error: true, message: "No user with that email." });
  }

  const decryptPassword = await compare(password, foundUserByEmail.password);

  if (!decryptPassword) {
    return res.status(400).send({ error: true, message: "Wrong password." });
  }

  const accessToken = sign(
  { 
    userId: foundUserByEmail.id,
    role: foundUserByEmail.role,
  },
  process.env.SECRET_TOKEN!,
  { expiresIn: "1h" });

  const refreshToken = sign(
    { 
      userId: foundUserByEmail.id,
      role: foundUserByEmail.role,
    },
    process.env.REFRESH_TOKEN!,
    { expiresIn: "1d" });

  await Token.update(
    { refresh_token: refreshToken },
    { where: { userId: foundUserByEmail.id }
  });

  res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: process.env.APP_ENV !== "dev", maxAge: 24 * 60 * 60 * 1000 });
  return res.status(200).send({ error: false, message: `Welcome back, ${foundUserByEmail.first_name}!`, accessToken });

}

export const signup = async(req: Request, res: Response, _next: NextFunction) => {

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
    username,
    password,
    firstName,
    lastName,
    email,
  } = req.body;

  const salt = await genSalt(10);
  const encryptedPassword = await hash(password, salt);

  const isUserDuplicate = await User.findOne({ where: { email }});

  if (isUserDuplicate) {
    return res.status(400).send({ error: true, message: "Sorry account already taken!" });
  }

  const newUser = await User.create({
    username,
    password: encryptedPassword,
    first_name: firstName,
    last_name: lastName,
    email,
    password_chances: 3,
    role: "USER",
    profile_picture_url: profilePicture,
  });

  await Token.create({
    userId: newUser.id,
  });

  if (!newUser) {
    return res.status(400).send({ error: true, message: "Registration failed, something went wrong!" });
  }

  return res.status(200).send({ error: false, message: `Welcome to blogit, ${firstName}!` });
}

export const signout = async(req: Request, res: Response, next: NextFunction) => {

  const { cookies } = req;
  
  if (!cookies.jwt) {
    return res.status(403).send({ error: true, message: "Unauthorized, no token found!" });
  }

  const token = cookies.jwt;

  const isTokenValid = await Token.findOne({ where: { refresh_token: token }});

  if (!isTokenValid) {
    return res.status(400).send({ error: true, message: "Please provide a valid user id!" });
  }

  if (!isTokenValid?.refresh_token === token) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(400).send({ error: false, message: "Something went wrong!" });
  }

  const removeRefreshToken = await Token.update(
    { refresh_token: null },
    { where: { userId: isTokenValid?.userId } },
  );
  
  if (removeRefreshToken) {
    res.clearCookie("jwt", { httpOnly: true });
    
    return res.status(200).send({ error: false, message: `See you later, ${isTokenValid?.userId}` });
  }

  return res.status(400).send({ error: true, message: "User not found!" });
}

export const refreshToken = async(req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;

  if (!cookies.jwt) {
    return res.status(401).send({ error: true, message: "No cookie found!" });
  }

  const refreshToken = cookies.jwt;

  const foundUserByRefreshToken = await Token.findOne({ where: { refresh_token: refreshToken }});

  if (!foundUserByRefreshToken) {
    return res.status(403).send({ error: true, message: "No user with that token! "});
  }

  let decoded: JwtPayload;

  try {
    const REFRESH_SECRET: string = process.env.REFRESH_TOKEN!;
    const SECRET: string = process.env.SECRET_TOKEN!;

    decoded = verify(foundUserByRefreshToken.refresh_token!, REFRESH_SECRET) as JwtPayload;

    const newAccessToken = sign(
      {
        userId: decoded.userId,
        role: decoded.role,
      },
      SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).send({ error: false, message: "Refresh token is verified", accessToken: newAccessToken });

  } catch (err: unknown) {
    if (err instanceof JsonWebTokenError) {
      return res.status(401).send({ error: true, message: err.message });
    }
  }



}