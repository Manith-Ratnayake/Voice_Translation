const { TranscribeClient } = require("@aws-sdk/client-transcribe");

const REGION = "ap-south-1"; 
const transcribeClient = new TranscribeClient({ region: REGION });

module.exports = { transcribeClient };
