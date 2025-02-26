import express from "express";
import https from "https";
import path from "path";
import fs from "fs";
import cors from "cors";
import multer from "multer";
import { Server } from "socket.io"


import { mydb }  from "./mysql.js";
import { uploadFileToS3 } from './s3.js';
import { triggerTranscriptionJob } from './transcribe_create_job.js';
import { istranscriptionCompleted } from './transcribe_list.js';
import { s3transcriptionToText } from "./s3Get.js";
import { textToSpeechPolly } from "./polly.js";
import { speechDownloadPolly } from "./s3GetPolly.js";



const options = {
    cert: fs.readFileSync('C:\\mnginx-1.26.3\\detailsofthewebsite\\certificate.crt'),
    key: fs.readFileSync('C:\\mnginx-1.26.3\\detailsofthewebsite\\private.key'),
};


const corsOptions = {
    origin: '*', 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Enable credentials if needed
};
  
  

const app = express();
const PORT = 3000;
const server = https.createServer(options, app);


app.use(cors(corsOptions));
app.use(express.json());


const io = new Server(server, {
    cors: {
      origin: ['https://www.manithbbratnayake.com', 'https://manithbbratnayake.com'], 
      methods: ['GET', 'POST'],
      credentials: true,  
    }
  });



let connectedUsers = {};


io.on('connection', (socket) => {

    //const userIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    const userID = socket.handshake.query.userID; 
    connectedUsers[userID] = socket.id; 
    console.log("A user connected: ", socket.id, userID);


// PLANNING TO REMOVE BELOW
  /* 
    socket.on("audio", (audioData, speakerLanguage) => {
        console.log("Receiving audio data...");
        const filePath = filePath`uploads/${userIP}${Date.now()}.wav`;
        fs.writeFileSync(filePath, Buffer.from(audioData));
        console.log(`Audio saved: ${filePath}`);
        AudioProcessing(audioData, speakerLanguage)    
    });

*/
    socket.on("searchListener", (listenerID) => {
      console.log("Received Listener id : ", listenerID);

      mydb.startConnection()
        .then(() => {
          return mydb.searchPeople(listenerID)
        })
        
        .then((results) => {
          mydb.closeConnection();
        })

        .catch((err) => {
          mydb.closeConnection();
        })
          
    });




    socket.on('sendaudio', (audioFile, recipientUserID) => {

      const recipientUserID  = connectedUsers[recipientUserID];

      if (recipientUserID) {
        io.to(recipientUserID).emit('receiveAuido', audioFile)
        console.log("Audio file sent from ${}")
      }
      else {
        console.log("Recipient with that id is not connected ")
      }
      
    });


    socket.on('disconnect', () => {
      for (const userID in connectedUsers){
        if (connectedUsers[userID]=== socket.id){
          delete connectedUser[userID]
        }
      }
    });



    //socket.on("userConnection", (listenerID) =>{
       //if listenerID in onlinePeople {
            


       //} 
    //});

 
    



    socket.on('disconnect', () => {
      console.log("A user disconnected:", socket.id);
    });

  });



app.post('/signin', (req, res) => {

  let email = req.body.email;
  let password = req.body.password;


  if (user) {
      res.json({message : "Sign In Successful"})
  } else {
    res.status(400).json({ message : "Invalid credentials"})
  }


}



app.post('/signup' , (req, res) => {


    let email = req.body.email;
    let password = req.body.password;


    


    if (user) {
      res.json({message : "Sign In Successful"})
    } else {
      res.status(400).json({message : "Invalid credentials"})
    }

}









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


server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at https://manithbbratanayake:${PORT}`);
});



const AudioProcessing = (audioData) => {


    await uploadFileToS3(filename);
    await uploadFileToS3(filename);
    console.log("audionumber before transcription start :", audioNumber )
    await triggerTranscriptionJob(filename, audioNumber, languageSender)
    console.log("audionumber before transcription finished :", audioNumber )
    await istranscriptionCompleted(`TranscriptionJob_${audioNumber}_${filename}`)
    //    await s3transcriptionToText({ file: `TranscriptionJob_${audioNumber}_${filename}.json` });
    let transcriptText = await s3transcriptionToText({ file: `TranscriptionJob_${audioNumber}_${filename}.json` });
    const mp3Url = await textToSpeechPolly(transcriptText, languageListener);
    console.log("mp3url : ", mp3Url)
    await textToSpeechPolly(transcriptText)
    await speechDownloadPolly(mp3Url)
    const audioFilePath = path.join(__dirname, 'downloads', mp3Url);
    return res.sendFile(audioFilePath);





}


// app.get("/database", async (req, res) => {
//     try {
//         console.log("name is ");
        
//         // Start connection
//         const connectionMessage = await mydb.startConnection();
//         console.log(connectionMessage);
        
//         // Fetch people
//         const people = await mydb.searchPeople();
//         console.log(people);
        
//         // Close connection
//         mydb.closeConnection();
        
//         // Respond with the fetched data
//         res.json({ message: people });
//     } catch (error) {
//         console.error("Error: ", error);
//         res.status(500).json({ message: "Internal server error", error });
//     }
// });


// app.post("/database", (req, res) => {
//     const { message } = req.body; // Use req.body to get the message
//     console.log("name is ", message);
//     res.send("Hi");
// });


// https.createServer(options, app).listen(PORT, () => {



//     // server.listen(PORT, '0.0.0.0', () => {
//         console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
    

/*
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

});



//import { mydb }  from "./mysql.js";
//import { uploadFileToS3 } from './s3.js';
import { triggerTranscriptionJob } from './transcribe_create_job.js';
import { istranscriptionCompleted } from './transcribe_list.js';
import { s3transcriptionToText } from "./s3Get.js";
import { textToSpeechPolly } from "./polly.js";
import { speechDownloadPolly } from "./s3GetPolly.js";
*/
