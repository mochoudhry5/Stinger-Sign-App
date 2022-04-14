import AWS from "aws-sdk";

export const S3Bucket = process.env.REACT_APP_S3_BUCKET_NAME;

export const Region = process.env.REACT_APP_S3_BUCKET_REGION_NAME;

export const MyBucket = new AWS.S3({
    params: { Bucket: process.env.REACT_APP_S3_BUCKET_NAME },
    region: process.env.REACT_APP_S3_BUCKET_REGION_NAME,
  });