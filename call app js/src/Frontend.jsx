import {useState, useRef, useEffect} from 'react';
import { io } from "socket.io-client";
import { languagesMap } from './languages';


export default function Frontend() {

// AUDIO RECORDING & SENDING
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    const [receivedAudioUrl, setReceivedAudioUrl] = useState(null);

  
    const [processedAudioUrl, setProcessedAudioUrl] = useState(null); 
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);


    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err instanceof Error ? err.message : "An error occurred");
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    
    const startRecording = () => {

        if (!stream) {
            alert("No microphone permission! Please grant access first.");
            return;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];    

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            audioChunksRef.current = [];
            setAudioUrl(URL.createObjectURL(audioBlob));
            handleAudioFile(audioBlob); 
        };

        mediaRecorder.start();
        setIsRecording(true);
    };


    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };


    const handleAudioFile = (audioBlob) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioBlob);
        
        reader.onloadend = () => {
            const audioData = reader.result; 
    
            if (socketRef.current) {
                socketRef.current.emit("audio", audioData, speakerLanguage);  
                console.log("Audio file sent via Socket.io");
            } else {
                console.error("Socket is not connected");
            }
        };
    };
    

// SOCKET CONNECTION
    const socketRef = useRef(null);

    useEffect(() => {
    
        socketRef.current = io("https://www.manithbbratnayake.com:3000");

        socketRef.current.on("connect", () => {
          console.log("Connected to the server");
        });

        socketRef.current.emit("message", "Hello Server");

        socket.Ref.current.on("recivedAudio", (audioData) => {
          console.log("Audio is received")
          setReceivedAudioUrl(audioData)
        });


        socketRef.current.on("disconnect", () => {
        console.log("Disconnected from the server");
    })

    
    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }};
    },[]); 

// IP ADDRESS & LANGUAGE 

    const [speakerIp, setspeakerIP] = useState("")
    const [speakerLanguage, setSpeakerLanguage] = useState("");


    const handleSpeakerLanguage = (event) => {
        setSpeakerLanguage(event.target.value);
        console.log("Selected Language:", event.target.value);
    };


    useEffect(() => {
        fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
            setspeakerIP(data.ip);  
        })
    .catch((error) => console.error("Error fetching IP:", error));
    }, []); 


// LISTNER SEARCH
    const [listenerId, setListenerId] = useState("");
    const [searchPersonUI, setSearchPersonUI] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");


    const searchPersonChange= (event) => {
        setListenerId(event.target.value);  // Update the state with the input value
    };

    
    const searchPersonButtonClick = () =>{

        let isPersonValid = checkPersonInDatabase(listenerId);
      
        
        if (isPersonValid) {
          setErrorMessage("")
          setSearchPersonUI(prevState => !prevState);
        }else {
          setErrorMessage("The person id is either invalid or not exist ")
        }
    }
    


    const checkPersonInDatabase = () => {
        if (socketRef.current) {
            socketRef.current.emit("searchListener", listenerId); 
            console.log("Listener ID sent:", listenerId);
        } else {
            console.error("Socket is not connected");
        }
    };

  

    return (
      <>

        <h1 className="center-container">You</h1>


        <p>Your IP Address : {speakerIp}</p>
        <p>You speaks in : {speakerLanguage}</p>

        <select
            className="form-select"
            style={{ backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ccc", width: "300px" }}
            aria-label="Default select example" value={speakerLanguage} onChange={handleSpeakerLanguage}>

            <option value="">Select the language you speak</option>
            {Array.from(languagesMap.entries()).map(([langKey, langName]) => (
            
                <option key={langKey} value={langKey}>
                    {langName}
                </option>
            
            ))}
        </select>



        <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button" className="btn btn-info">
                            Get Microphone
                        </button>
                    ) : null}

                    {permission && !isRecording ? (
                        <button onClick={startRecording} type="button" className="btn btn-light">
                            Start Speaking
                        </button>
                    ) : null}

                    {isRecording ? (
                        <button onClick={stopRecording} type="button" className="btn btn-light">
                            Stop Speaking
                        </button>
                    ) : null}

                    {audioUrl && (
                        <div>
                            <h3>Recorded Audio</h3>
                            <audio controls>
                                <source src={audioUrl} type="audio/webm" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>

                <h1 className='mt-3'>Listener</h1>


                <div className="mb-2 mt-3">


                    {searchPersonUI ?(
     
                      <div>
                          <input type="text" className="form-control" id="inputBox"
                           aria-label="Default" placeholder="Listener ID" value={listenerId} onChange={searchPersonChange}/>
                          <button className="btn btn-primary" onClick={searchPersonButtonClick}>Search</button>

                          <h5>{errorMessage}</h5>


                      </div>
                    ) : (
                      <button className="btn btn-warning" onClick={searchPersonButtonClick}>Disconnect</button>
                    )}
                </div>

                  
                <div>
      
                    {receivedAudioUrl && (
                        <div>
                            <h3>Recived Audio</h3>
                            <audio controls>
                                <source src={receivedAudioUrl} type="audio/webm" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>

                
      </>
    )



}
