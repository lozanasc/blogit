import { Request} from "express";
import { FileFilterCallback } from "multer";

export const fileFilter = (
  request: Request | any,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
  ) {
      callback(null, true)
  } else {
      callback(null, false)
  }};