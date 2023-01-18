import { createReadStream } from "fs"
import { bucket, S3 } from "../config";

export const uploadImage = (file: Express.Multer.File) => {
  const fileStream = createReadStream(file.path);

  const uploadParams = {
    Bucket: bucket,
    Body: fileStream,
    Key: file.filename,
  }

  return S3.upload(uploadParams).promise();
}

export const getFileStream = (filekey: string) => {
  const downloadParams = {
    Key: filekey,
    Bucket: bucket,
  }

  return S3.getObject(downloadParams).createReadStream()
}