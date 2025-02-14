import { StartTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { transcribeClient } from "./transcribeClient.js";

const triggerTranscriptionJob = async (filename, number, languageCodeAWS) => {
  console.log("Inside the trigger function");

  const params = {
    TranscriptionJobName: `TranscriptionJob_${number}_${filename}`,
    LanguageCode: languageCodeAWS,
    MediaFormat: "wav",
    Media: {
      MediaFileUri: `s3://voicebuketmanithratnayake/${filename}`,
    },
    OutputBucketName: "voiceoutputbucketmanithratnayake",

  };

  try {
    const data = await transcribeClient.send(
      new StartTranscriptionJobCommand(params)
    );
    console.log("Success - put", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export { triggerTranscriptionJob };