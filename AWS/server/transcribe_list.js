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