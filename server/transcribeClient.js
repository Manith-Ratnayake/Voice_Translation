import { TranscribeClient } from "@aws-sdk/client-transcribe";

const REGION = "ap-south-1"; 
const transcribeClient = new TranscribeClient({ region: REGION });

export { transcribeClient };
