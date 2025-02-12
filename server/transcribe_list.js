import { ListTranscriptionJobsCommand } from "@aws-sdk/client-transcribe";
import { transcribeClient } from "./transcribeClient.js";



export const istranscriptionCompleted =  async (transcriptionFileName) => {
  console.log("\n\nTranscription File Name: ", transcriptionFileName);

  const params = {
    JobNameContains: transcriptionFileName,
  };

  try {
    while (true) {
      const data =  await transcribeClient.send(
        new ListTranscriptionJobsCommand(params)
      );

      console.log("Checking transcription job...");
      //console.log("Data received:");

      if (data.TranscriptionJobSummaries && data.TranscriptionJobSummaries.length > 0) {
        const job = data.TranscriptionJobSummaries.find(
          (job) => job.TranscriptionJobName === transcriptionFileName
        );

        if (job && job.TranscriptionJobStatus === "COMPLETED") {
          console.log("Transcription job completed!", data.TranscriptionJobSummaries);
          return true;
        }

        if (job && job.TranscriptionJobStatus === "FAILED") {
          console.log("Transcription job failed!", data.TranscriptionJobSummaries);
          return false;
        }
      }

      console.log("Transcription job not completed yet, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};











/*

export const istranscriptionCompleted =  (transcriptionFileName) => {

  console.log("\n\n transcriptionFileName : ", transcriptionFileName)

  let params = {
    JobNameContains: `${transcriptionFileName}`,
  };


  try {
    while (true) { 
      const data = transcribeClient.send(
        new ListTranscriptionJobsCommand(params)
      );

      console.log("Checking transcription job...");
      console.log("Data inside the var : ", data.TranscriptionJobSummaries)

      if (data.TranscriptionJobSummaries) {
        console.log("Transcription job found!");
        return true;  // Exit loop when job is found
      }

      console.log("No transcription job found, retrying...");

      // Blocking delay (Busy-waiting)
      const start = Date.now();
      while (Date.now() - start < 500);  // Wait for 1 second before retrying
    }
  } catch (err) {
    console.log("Error", err);
    return null;  // Handle any errors
  }
};


*/

//istranscriptionCompleted("TranscriptionJob_1_audio-0.wav")




/* 
export const istranscriptionCompleted = async (transcriptionFileName) => {

  let params = {
    JobNameContains: `${transcriptionFileName}`, 
  };


  try {
    const data = await transcribeClient.send(
      new ListTranscriptionJobsCommand(params),
    );
    console.log("Success", data.TranscriptionJobSummaries);
    return data;
  } catch (err) {
    console.log("Error", err);
  }

  console.log("transciption list is end")


};









  try {
    while (true) { 
      data = transcribeClient.send(
        new ListTranscriptionJobsCommand(params),
      );

      console.log("Checking transcription job...");

      if (data.TranscriptionJobSummaries.length > 0) {
        console.log("Transcription job found!");
        break;
      }

      console.log("No transcription job found, retrying...");
      
       new Promise(resolve => setTimeout(resolve, 10)); 
    }
  } catch (err) {
    console.log("Error", err);
    return null; // Handle any error
  } 
};










*/
