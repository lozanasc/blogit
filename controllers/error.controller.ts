import { Request, Response, NextFunction } from "express";

export const notFound = async(_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).send({ error: true, message: "Not found!" });
}