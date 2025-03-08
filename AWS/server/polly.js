import { PollyClient, StartSpeechSynthesisTaskCommand, GetSpeechSynthesisTaskCommand, LanguageCode } from "@aws-sdk/client-polly";


export const textToSpeechPolly = async (text, languageListener) => {

    const client = new PollyClient({ region: "ap-south-1" });

    console.log("Text inside the textToSpeech : ", text)

    const params = {
      OutputFormat: "mp3",
      OutputS3BucketName: "voicetranslationpollymanith", 
      Text: text,
      TextType: "text",
      VoiceId: "Joanna",
      LanguageCode: languageListener
    };

   
    let outputAudioFileName = ""

    try {

      const data = await client.send(new StartSpeechSynthesisTaskCommand(params));
      console.log("Task Started:", data.SynthesisTask.TaskId);
      let taskStatus = "inProgress";
      let outputUri = null;

      while (taskStatus === "inProgress" || taskStatus === "scheduled") {

        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        const taskData = await client.send(
          new GetSpeechSynthesisTaskCommand({ TaskId: data.SynthesisTask.TaskId }));
        
        taskStatus = taskData.SynthesisTask.TaskStatus;
        console.log("Current Task Status:", taskStatus);

        if (taskStatus === "completed") {
          console.log("Success! MP3 file saved to S3:", taskData.SynthesisTask.OutputUri);
          outputAudioFileName = (taskData.SynthesisTask.OutputUri).split('/').pop();
          break;

        } else if (taskStatus === "failed") {
          console.error("Task Failed:", taskData.SynthesisTask.FailureReason);
          break;
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }



    return outputAudioFileName
};