const { StartTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
const { transcribeClient } = require("./transcribeClient.js");



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




// Export function using CommonJS
module.exports = { triggerTranscriptionJob };














/*

export const params = (filename) => ({
  TranscriptionJobName: `TranscriptionJob_${filename}`,
  LanguageCode: "en-US", 
  MediaFormat: "wav", 
  Media: {
    MediaFileUri: `s3://your-bucket-name/${filename}`, // Use dynamic filename here
  },
  OutputBucketName: "your-output-bucket-name", // Change this to your output bucket
});




export const run = async () => {
  try {
    const data = await transcribeClient.send(
      new StartTranscriptionJobCommand(params),
    );
    console.log("Success - put", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};


*/











const name = "s3://voicebuketmanithratnayake/englisholdaudio.wav"
const name2 = "voiceoutputbucketmanithratnayake"