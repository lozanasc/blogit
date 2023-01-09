import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    currentUser: string;
    role: string;
    skipVerifyJwt: boolean;
    skip: boolean;
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    userId: string;
    role: string;
  }
}

export default function verifyJwt(req: Request, res: Response, next: NextFunction){

  if (req.skip) {
    return next();
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.status(401).send({ error: true, message: "Invalid header!" });
  }

  const jwtToken = authorizationHeader.split(' ')[1]

  let decoded: JwtPayload;

  try {

    const SECRET: string = process.env.SECRET_TOKEN!;
    
    decoded = jwt.verify(jwtToken, SECRET) as JwtPayload;

    req.currentUser = decoded.userId;

    req.role = decoded.role;

  } catch (err: unknown) {

    if (err instanceof JsonWebTokenError) {
      return res.status(401).send({ error: true, message: err.message });
    }

  }

  next();
}