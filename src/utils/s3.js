import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIA3KZVK3RM6V72UAHV",
  secretAccessKey: "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",
  region: "ap-south-1",
  signatureVersion: "v4",
});

export const s3 = new AWS.S3();

export const getPreSignedURL = (fileName) => {
  const obj = s3.getSignedUrl("getObject", {
    Bucket: "equip9-testing",
    Key: fileName,
    Expires: 60 * 10,
  });
  console.log({ obj });
  return obj;
};
