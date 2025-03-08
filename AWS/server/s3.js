import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";


export const uploadFileToS3 = async (audioFile, fileName) => {
  const bucket = "voicebuketmanithratnayake";

  const client = new S3Client({
    region: "ap-south-1",
  });


  const input = {
    Bucket: bucket,
    Key: fileName,
    Body: audioFile,
  };

  const command = new PutObjectCommand(input);

  try {
    const response = await client.send(command);
    console.log("File uploaded to S3: ", response);
  } catch (error) {
    console.error("Error uploading file to S3: ", error);
  }
};


export default uploadFileToS3;
