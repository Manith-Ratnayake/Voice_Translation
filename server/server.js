const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const mydb = require("./mysql.js");
const app = express();
const PORT = 3000;

const multer = require('multer');
const uploadFileToS3 = require('./s3.js');
const { triggerTranscriptionJob } = require('./transcribe_create_job');
const { istranscriptionCompleted } = require('./transcribe_list.js');
const { s3transcriptionToText } = require("./s3Get.js");
const { textToSpeechPolly } = require("./polly.js")
const { speechDownloadPolly } = require("./s3GetPolly.js")


app.use(cors()); 
app.use(express.json()); 


try {
    fs.mkdirSync("uploads", { recursive: true });
} catch (err) {
    console.error("Error creating uploads directory:", err);
}



const storage = multer.diskStorage({
    destination: "uploads/", // Folder where files will be stored
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the filename from the frontend
    },
});


const upload = multer({ storage });
app.use(express.static("./uploads"));


app.get("/", ( req, res) => {
    res.send("<h1>🚀 Server is running...</h1>");
});



let audioNumber = -1;
app.post("/uploads", upload.single("audio"), async (req, res) => {
    

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }


    const languageSender    = req.body.languageSender;
    const languageListener  = req.body.languageListener;
    const senderIpAddress   = req.body.senderIpAddress;
    const listenerIpAddress = req.body.listenerIpAddress
    const filename          = req.file.filename; 


    console.log(`✅ File received: ${req.file.filename}`);
    console.log(`Language: ${languageListener}`);
    console.log("audionumber before s3 file start :", audioNumber )


    await uploadFileToS3(filename);

    console.log("audionumber before transcription start :", audioNumber )

    await triggerTranscriptionJob(filename, audioNumber, languageSender)
    
    console.log("audionumber before transcription finished :", audioNumber )
    await istranscriptionCompleted(`TranscriptionJob_${audioNumber}_${filename}`)


    //    await s3transcriptionToText({ file: `TranscriptionJob_${audioNumber}_${filename}.json` });
    let transcriptText = await s3transcriptionToText({ file: `TranscriptionJob_${audioNumber}_${filename}.json` });
    const mp3Url = await textToSpeechPolly(transcriptText, languageListener);
    console.log("mp3url : ", mp3Url)

//    await textToSpeechPolly(transcriptText)
    await speechDownloadPolly(mp3Url)

    const audioFilePath = path.join(__dirname, 'downloads', mp3Url);
    return res.sendFile(audioFilePath);

    console.log("Program final line")


});


app.get("/database", async (req, res) => {
    try {
        console.log("name is ");
        
        // Start connection
        const connectionMessage = await mydb.startConnection();
        console.log(connectionMessage);
        
        // Fetch people
        const people = await mydb.searchPeople();
        console.log(people);
        
        // Close connection
        mydb.closeConnection();
        
        // Respond with the fetched data
        res.json({ message: people });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});


app.post("/database", (req, res) => {
    const { message } = req.body; // Use req.body to get the message
    console.log("name is ", message);
    res.send("Hi");
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});


/*
   try {
         uploadFileToS3

    } catch (error) {
        console.error("Error uploading to S3:", error);
        res.status(500).json({ message: "Error uploading to S3", error: error.message });
    }



*/
