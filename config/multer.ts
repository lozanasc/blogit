import { Request } from "express";
import { randomBytes } from "crypto";
import multer from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = multer.diskStorage({
  destination: (
      request: Request,
      file: Express.Multer.File,
      callback: DestinationCallback
  ): void => {
      callback(null, "./storage/");
  },

  filename: (
      request: Request,
      file: Express.Multer.File, 
      callback: FileNameCallback
  ): void => {
      callback(null, `${randomBytes(5).toString("hex")}_${file.originalname.replace(/\s/g, "")}`);
  }
});