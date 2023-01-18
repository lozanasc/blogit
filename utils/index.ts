import { options } from "./cors";
import { fileFilter } from "./multer";
import { paginate } from "./paginate";
import { uploadImage, getFileStream  } from "./s3";
import { compare } from "./compare";

export {
  paginate,
  fileFilter,
  options,
  uploadImage,
  getFileStream,
  compare,
};
