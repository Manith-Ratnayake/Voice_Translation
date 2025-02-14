import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";



const uploadFileToS3 = async (filename) => {
  let bucket = "voicebuketmanithratnayake";

  const client = new S3Client({
    region: "ap-south-1",
  });

  const filePath = path.join(__dirname, 'uploads', filename);
  const filestream = fs.createReadStream(filePath); // Future : Buffer directly

  const input = {
    Bucket: bucket,
    Key: filename,
    Body: filestream,
  };

  const command = new PutObjectCommand(input);

  try {
    const response = await client.send(command);
    console.log("File uploaded to S3: ", response);
  } catch (error) {
    console.error("Error uploading file to S3: ", error);
  }
};



export { uploadFileToS3 };





/*
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");


const uploadFileToS3 = async (filename) => {
 
    let bucket = ""

        const client = new S3Client({
            region: "ap-south-1",
        });

        const filePath = path.join(__dirname, 'uploads', filename);
        const filestream = fs.createReadStream(filePath); // Future : Buffer directly
        //console.log("filestream : ", filestream, "filename : ", filename)

        const input = {
            Bucket: bucket,  
            Key: filename,                 
            Body: filestream,           
        };

        const command = new PutObjectCommand(input);

        try {
            const response = await client.send(command);
            console.log("File uploaded to S3: ", response);
        } catch (error) {
            console.error("Error uploading file to S3: ", error);
        }



};


module.exports = uploadFileToS3; 







//voicebuketmanithratnayake
