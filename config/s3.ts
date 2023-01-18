import AWS_S3 from "aws-sdk/clients/s3";

const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

export const bucket = process.env.AWS_BUCKET_NAME!;

export const S3 = new AWS_S3({
  region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});