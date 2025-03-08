import { S3Client, GetObjectCommand, NoSuchKey, S3ServiceException } from "@aws-sdk/client-s3";
//const { S3Client, GetObjectCommand, NoSuchKey, S3ServiceException } = require("@aws-sdk/client-s3");



export const s3transcriptionToText = async ({ file }) => {

  console.log("\n\nfilekey :" , file )


  const REGION = "ap-south-1";
  const BUCKET_NAME = "voiceoutputbucketmanithratnayake" 
  const FILE_KEY = file;

  if (!FILE_KEY) {
    throw new Error("File key is missing or invalid.");
  }

  console.log("\n\nfilekey :" , FILE_KEY )
  const client = new S3Client({ region: REGION });

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
      })
    );

    const str = await response.Body.transformToString();
    const jsonData = JSON.parse(str);
    const transcriptText = jsonData.results.transcripts[0].transcript;

    console.log("Extracted Text:\n", transcriptText);
    return transcriptText;
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      console.error(`Error: No such key "${FILE_KEY}" in bucket "${BUCKET_NAME}".`);
    } else if (caught instanceof S3ServiceException) {
      console.error(`S3 Error: ${caught.name}: ${caught.message}`);
    } else {
      console.error("Unexpected Error:", caught);
    }
    return transcriptText;
  }
};
