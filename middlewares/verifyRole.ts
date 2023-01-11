import { NextFunction, Request, Response } from "express";

export const verifyRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (req.skip) {
      return next();
    }

    if (!req.role) {
      return res.status(401).send({ error: true, message: "Invalid token!" });
    }

    const verify = roles.includes(req.role);

    if (!verify) {
      return res.status(401).send({ error: true, message: "Sorry you're not permitted to do such action!" });
    }

    next();
  }
}