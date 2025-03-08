import { StartTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { transcribeClient } from "./transcribeClient.js";

const triggerTranscriptionJob = async (fileName, languageCodeAWS) => {
  console.log("Inside the trigger function");

  const params = {
    TranscriptionJobName: `TranscriptionJob_${fileName}`,
    LanguageCode: languageCodeAWS,
    MediaFormat: "wav",
    Media: {
      MediaFileUri: `s3://voicebuketmanithratnayake/${fileName}`,
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
