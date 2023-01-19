import { Request, Response, NextFunction } from "express";

import { getFileStream } from "../utils";

export const getFileFromStorage = (req: Request, res: Response, next: NextFunction) => {
  const { key } = req.params;

  const readStream = getFileStream(key);

  readStream.pipe(res);
}