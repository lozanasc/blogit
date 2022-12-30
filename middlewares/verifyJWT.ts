import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    currentUser: string;
    role: string;
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    username: string;
    role: string;
  }
}

export default function verifyJWT(req: Request, res: Response, next: NextFunction){

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.status(401).send({ error: true, message: "Invalid header!" });
  }

  const jwtToken = authorizationHeader.split(' ')[1]

  let decoded: JwtPayload;

  try {

    const SECRET: string = process.env.SECRET_TOKEN!;
    
    decoded = jwt.verify(jwtToken, SECRET) as JwtPayload;

    req.currentUser = decoded.username;

    req.role = decoded.role;

  } catch (err: any) {
    res.status(401).send({ error: true, message: "Invalid token!" });
  }

  next();
}