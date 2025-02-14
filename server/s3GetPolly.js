import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';



export const speechDownloadPolly = async (file) => {
  const REGION = "ap-south-1";
  const BUCKET_NAME = "voicetranslationpollymanith";  
  const FILE_KEY = file;
  const LOCAL_FOLDER = "downloads"; 

  if (!FILE_KEY) {
    throw new Error("File key is missing or invalid.");
  }

  console.log("\n\nfilekey :", FILE_KEY);
  const client = new S3Client({ region: REGION });

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
      })
    );
  
    if (!fs.existsSync(LOCAL_FOLDER)) {
      fs.mkdirSync(LOCAL_FOLDER, { recursive: true });
    }

    const localFilePath = path.join(LOCAL_FOLDER, path.basename(FILE_KEY));  // ✅ Fix variable name

    const fileStream = fs.createWriteStream(localFilePath);
    response.Body.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });

    console.log("✅ File downloaded successfully to:", localFilePath);
    return localFilePath;
  } catch (error) {
    console.error("❌ Error downloading file:", error);
    throw error;
  }
};

  
  
  

/*
  
  const client = new PollyClient({ region: "ap-south-1" });

  console.log("Text inside the textToSpeech : ", text);

  const params = {
    OutputFormat: "mp3",
    OutputS3BucketName: "voicetranslationpollymanith", // Set your S3 bucket name
    Text: text,
    TextType: "text",
    VoiceId: "Joanna",
  };

  try {
    const data = await client.send(new StartSpeechSynthesisTaskCommand(params));
    console.log("Task Started:", data.SynthesisTask.TaskId);

    let taskStatus = "scheduled";
    let outputUri = null;

    while (taskStatus === "scheduled" || taskStatus === "inProgress") {
       new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again

      const taskData = await client.send(
        new GetSpeechSynthesisTaskCommand({ TaskId: data.SynthesisTask.TaskId })
      );
      taskStatus = taskData.SynthesisTask.TaskStatus;

      console.log("Current Task Status:", taskStatus);

      if (taskStatus === "completed") {
        outputUri = taskData.SynthesisTask.OutputUri;
        console.log("✅ Success! MP3 file saved to S3:", outputUri);
        return outputUri; // Return the S3 URL
      } else if (taskStatus === "failed") {
        console.error("❌ Task Failed:", taskData.SynthesisTask.FailureReason);
        throw new Error("Polly task failed: " + taskData.SynthesisTask.FailureReason);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err);
    throw err; // Ensure calling function knows about the failure
  }
};






































/*
export const textToSpeechPolly = async (text) => {
  const client = new PollyClient({ region: "ap-south-1" });

  console.log("Text inside the textToSpeech : ", text);

  const params = {
    OutputFormat: "mp3",
    OutputS3BucketName: "", 
    Text: text,
    TextType: "text",
    VoiceId: "Joanna",
  };

  try {
    const data = await client.send(new StartSpeechSynthesisTaskCommand(params));
    console.log("Task Started:", data.SynthesisTask.TaskId);

    let taskStatus = "inProgress";
    let outputUri = "";

    while (taskStatus === "inProgress") {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before checking again

      const taskData = await client.send(new GetSpeechSynthesisTaskCommand({ TaskId: data.SynthesisTask.TaskId }));
      taskStatus = taskData.SynthesisTask.TaskStatus;

      console.log("Current Task Status:", taskStatus);

      if (taskStatus === "completed") {
        outputUri = taskData.SynthesisTask.OutputUri;
        console.log("✅ Success! MP3 file saved to S3:", outputUri);
        return outputUri;  // ✅ Return the file URL to ensure synchronous execution
      } else if (taskStatus === "failed") {
        console.error("❌ Task Failed:", taskData.SynthesisTask.FailureReason);
        throw new Error("Polly task failed: " + taskData.SynthesisTask.FailureReason);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err);
    throw err; // Ensure the calling function knows about the failure
  }
};
*/













/*
export const s3PollyRecording = async (file) => {

  const REGION = "ap-south-1"; 
  const BUCKET_NAME = "voicetranslationpollymanith"; 
  const FILE_KEY = file; 



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


  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      console.error(`Error: No such key "${key}" in bucket "${bucketName}".`);
    } else if (caught instanceof S3ServiceException) {
      console.error(`S3 Error: ${caught.name}: ${caught.message}`);
    } else {
      console.error("Unexpected Error:", caught);
    }
  }

};

*/