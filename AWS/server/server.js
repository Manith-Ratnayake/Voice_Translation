import express from "express";
import https from "https";
import path from "path";
import fs from "fs";
import cors from "cors";
import multer from "multer";
import { Server } from "socket.io"
import { fileURLToPath } from 'url';


import { mydb }  from "./mysql.js";
import { uploadFileToS3 } from './s3.js';
import { triggerTranscriptionJob } from './transcribe_create_job.js';
import { istranscriptionCompleted } from './transcribe_list.js';
import { s3transcriptionToText } from "./s3Get.js";
import { textToSpeechPolly } from "./polly.js";
import { speechDownloadPolly } from "./s3GetPolly.js";
import { translateText} from "./translate.js"


export const languagesMap = new Map([

  ["en-GB", "English"],
  ["fr-FR", "French"],
  ["hi-IN", "Hindi"],
  ["de-DE", "German"],
  ["ru-RU", "Russian"]

]);

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


  
  // Manually define __filename and __dirname in ES module
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);





let connectedUsers = [];
let connectedPairs = [];

io.on('connection', (socket) => {

    const { userID, speakerLanguage } = socket.handshake.query;
    console.log("A user connected: ", socket.id, userID);
    
    const user = {
      userID : userID,
      socketID : socket.id,
      speakerLanguage : speakerLanguage
    };

    connectedUsers.push(user);
    console.log(connectedUsers)

    socket.on("searchListener", (listenerID, speakerID) => {
      console.log("Received Listener id : ", listenerID);

      const listener = connectedUsers.find(user => user.userID === listenerID);

      if (listener) {
          connectedPairs.push([listenerID, speakerID ])
          socket.emit("searchListenerAnswer", true);
      }

      else {
        socket.emit("searchListenerAnswer", false);
        console.log("Socket emitted false");
      }

    });

    socket.on('SpeakingLanguage', ({ userID, newSpeakerLanguage }) => {
      console.log(`Updating speakerLanguage for userID: ${userID} to ${newSpeakerLanguage}`);
  
      // Find the user and update the speakerLanguage
      const userIndex = connectedUsers.findIndex(user => user.userID === userID);
      if (userIndex !== -1) {
          connectedUsers[userIndex].speakerLanguage = newSpeakerLanguage;
          console.log(`Updated speakerLanguage:`, connectedUsers[userIndex]);
      } else {
          console.log(`User with userID ${userID} not found.`);
      }
  });
  

    socket.on('sendaudio', async (audioFile, userID,  speakerLanguage) => {

      console.log("Audio User Id : ", userID);
      console.log("send audio received an audio file : ")
      let pairedConnectedUsers = connectedPairs.find(user => user.includes(userID));
      let listenerUserID = pairedConnectedUsers.find(id => id.userID !== userID);
      console.warn("SEND AUDIO TEST : ", listenerUserID);



      if (listenerUserID) {
        
        let connectedlistenerSocketID = connectedUsers.find(user  => user.userID === listenerUserID);
        let listenerSocketID = connectedlistenerSocketID.socketID;
        let listenerSpeakingLanguage = listenerUserID.speakerLanguage;
        

        console.log("Before sending every details here ", connectedUsers);
        console.log("Socket id name : ", listenerSocketID);
        console.log("Listener Speaking language : ", listenerSpeakingLanguage);

        //let downloadsDir = path.join(__dirname, 'downloads');
        let downloadsDir = path.join(__dirname, 'downloads');
        let processedAudio = await AudioProcessing(audioFile, speakerLanguage, listenerSpeakingLanguage)
        processedAudio = path.basename(processedAudio);
        let lastAudioFilePath = path.join(downloadsDir, processedAudio);

        
        

        console.log("download dir ", downloadsDir)
        console.log("processedAudio : ", processedAudio);
        console.log("last full url : ", lastAudioFilePath )
        let audioDataSending = fs.readFileSync(lastAudioFilePath);


        io.to(listenerSocketID).emit('receivedAudio', audioDataSending) // audioFile
        console.log("Audio file sent from ${}")

      } else {
        console.log("Recipient with that id is not connected ")
        socket.emit("listenerIsDisconnected", false)
      }
      
    });


    socket.on('disconnect', () => {

      console.log("User Disconnected : ")
      const userIndex = connectedUsers.findIndex(user => user.socketID === socket.id)

      if (userIndex !== -1){
        connectedPairs.splice(userIndex, 1)
      }

      connectedPairs = connectedPairs.filter(pair => pair.speaker !== userID && pair.listener !== userID);

      for (const userID in connectedUsers){
        if (connectedUsers[userID]=== socket.id){
          delete connectedUsers[userID]
          console.log("Deleted the user")
        }
      }
    });


  });


app.post('/signin', async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;


  try {
    let _  = await mydb.startConnection();
    let user = await mydb.authenticationSignIn(email, password);
    await mydb.closeConnection()


    if (user) {
        res.json({message : "Sign In Successful"})
    } else {
      res.status(400).json({message : "Invalid credentials"})
    }

    }catch(error){
      console.log("Error ocured : ", error)
      return res.status(500).json({message : "Internal Server Error !!!"});
    }

});



app.post('/signup' , async (req, res) => {


    console.log("Request came")
    let email = req.body.email;
    let password = req.body.password;


    try {
        let dbConnection = await mydb.startConnection();
        let user = await mydb.authenticationSignUp(email, password);
        await mydb.closeConnection()
        res.json({message : "Sign Up Successful"})
    

    }catch(error){
      console.log("Error ocured : ", error)
      return res.status(500).json({message : "Internal Server Error !!!"});
    }

})


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
    console.log(`🚀 Server running at https://www.manithbbratanayake:${PORT}`);
});



const AudioProcessing = async (audioFile, speakerLanguage, listenerLangauge) => {

    console.log("Listener Language : ", listenerLangauge);
  

    if (!listenerLangauge){
      listenerLangauge = "fr-FR"
    }

    let currentTime = new Date().toString();  
    let fileName = currentTime.toString().replace(/[^0-9a-zA-Z._-]/g, "_");

    await uploadFileToS3(audioFile, fileName);
    console.log("audionumber before transcription start :" )

    await triggerTranscriptionJob(fileName, speakerLanguage)
    console.log("audionumber before transcription finished :")

    await istranscriptionCompleted(`TranscriptionJob_${fileName}`)
    console.log("transcription job finished");
    let transcriptText = await s3transcriptionToText({ file: `TranscriptionJob_${fileName}.json` });


    let translatedText = await translateText(transcriptText, speakerLanguage, listenerLangauge);
    console.log("Before passing the value to the function ,", translatedText)
    let mp3Url = await textToSpeechPolly(translatedText, listenerLangauge);
    console.log("mp3url : ", mp3Url)
    //await textToSpeechPolly(transcriptText)
    let downloadedAudioUrl =   await speechDownloadPolly(mp3Url)
    return (downloadedAudioUrl)


}
