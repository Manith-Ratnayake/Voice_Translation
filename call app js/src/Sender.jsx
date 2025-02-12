/*
import { useState, useRef } from "react";
import { languages } from './languages';


const Sender = () => {


    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);


    const userName = "Manith" // Future Implementation

    const handleAudioFile = async (audioBlob) => {
        console.log("Audio File:", audioBlob);

            
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav"); 
        formData.append("language", selectedLanguage)

        try {
            const response = await fetch("http://localhost:3000/uploads", {
                method: "POST",
                body: formData,
            });



            if (response.ok) {
                const audioBlobResponse = await response.blob(); 
                
                const audioUrl = URL.createObjectURL(audioBlobResponse);
    
                // Create an audio element and set the source to the URL created
                const audio = new Audio(audioUrl);
    
                // Play the audio
                audio.play();
    
                console.log("Audio is playing...");
            } else {
                const result = await response.text();
                console.log("Server Response:", result);
            }



            const result = await response.text();
            console.log("Server Response:", result);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

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

    // Create a new MediaRecorder instance for each recording
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = []; // Reset audio chunks

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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




///////////////////////////////////////////////////////////////////////////////////////////////////////

  const sendMessage = async () => {
        try {
            const response = await fetch("http://localhost:3000/database", { 
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const text = await response.json();
            console.log(text['message']['0']['ip']);
            
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    const [selectedLanguage, setSelectedLanguage] = useState("");

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
        console.log("Selected Language:", event.target.value); 
    };


///////////////////////////////////////////////////////////////////////////////////////////////////////


    return (

        <>
*/
{/*  */}

/*
<div className="container" style={{ display: 'flex' , margin:0, padding:0}}>
        <div className="A" style={{ width: '50%', padding: '20px', boxSizing: 'border-box', backgroundColor: 'lightblue' }}>
        <h2>You</h2>

        <p>IP Address : </p>
        <p>Username : </p>
       

        <p>Selected Language : {selectedLanguage}</p>

        <select 
            className="form-select" 
            style={{ backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ccc", width: "300px" }} 
            aria-label="Default select example" value={selectedLanguage}  onChange={handleChange}>

                <option value="">Select the language you speaking</option>
                
                {languages.map((lang, index) => (
                    <option key={index} value={lang}>{lang}</option>
                ))}

        </select>


        <button onClick={sendMessage} className="btn btn-secondary">Click me</button>

           
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
  


            
        </div>
        
              

    <div className="B" style={{ width: '50%', padding: '20px', boxSizing: 'border-box', backgroundColor: 'green' }}>

            <h1>Listener</h1>

            <p>IP Address : </p>
            <p>Username : </p>
            <p>Speaking in {} language</p>

    </div>



    {audioUrl && (
                <div>
                    <h3>R</h3>
                    {/* Audio player with controls 
                    <audio controls>
                        <source src={audioUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                <div>
            






</div>



        </>
    );
};

export default Sender;*/

import { useState, useRef } from "react";
import { languagesMap } from './languages';

const Sender = () => {

    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    const [selectedLanguageSender, setSelectedLanguageSender] = useState("");
    const [selectedLanguageListener, setSelectedLanguageListener] = useState("");

    const [processedAudioUrl, setProcessedAudioUrl] = useState(null); // For processed audio
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Handle the audio file sending logic
    const handleAudioFile = async (audioBlob) => {
        console.log("Audio File:", audioBlob);

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");
        formData.append("languageSender", selectedLanguageSender);
        formData.append("languageListener", selectedLanguageListener);


        try {
            const response = await fetch("http://localhost:3000/uploads", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const audioBlobResponse = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlobResponse);

                // Set the audio URL for the processed audio from the backend
                setProcessedAudioUrl(audioUrl);
                console.log("Processed Audio is ready!");

                // Optionally, play the processed audio immediately
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                const result = await response.text();
                console.log("Server Response:", result);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Get microphone permission
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

    // Start the audio recording
    const startRecording = () => {
        if (!stream) {
            alert("No microphone permission! Please grant access first.");
            return;
        }

        // Create a new MediaRecorder instance for each recording
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = []; // Reset audio chunks

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            setAudioUrl(URL.createObjectURL(audioBlob));
            handleAudioFile(audioBlob); // Send the audio file to the backend
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    // Stop the audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Send message to the backend (demo request)
    const sendMessage = async () => {
        try {
            const response = await fetch("http://localhost:3000/database", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const text = await response.json();
            console.log(text['message']['0']['ip']);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };



    const handleChangeSender = (event) => {
        setSelectedLanguageSender(event.target.value);
        console.log("Selected Language:", event.target.value);
    };


    const handleChangeListner = (event) => {
        setSelectedLanguageListener(event.target.value);
        console.log("Selected Language:", event.target.value);
    };


    return (
        <>
            <div className="container" style={{ display: 'flex', margin: 0, padding: 0 }}>
                {/* Left side - Sender */}
                <div className="A" style={{ width: '50%', padding: '20px', boxSizing: 'border-box', backgroundColor: 'lightblue' }}>
                    <h2>You</h2>
                    <p>IP Address : </p>
                    <p>Username : </p>
                    <p>Selected Language : {selectedLanguageSender}</p>

                    <select
                        className="form-select"
                        style={{ backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ccc", width: "300px" }}
                        aria-label="Default select example" value={selectedLanguageSender} onChange={handleChangeSender}
                    >
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
                    <br/>
                    <button onClick={sendMessage} className="btn btn-secondary">Database Connection</button>

                </div>



                {/* Right side - Listener */}
                <div className="B" style={{ width: '50%', padding: '20px', boxSizing: 'border-box', backgroundColor: 'green' }}>
                    <h1>Listener</h1>
                    <p>IP Address : </p>
                    <p>Username : </p>
                    <p>Listening in : {selectedLanguageListener} language</p>


                    <select
                        className="form-select"
                        style={{ backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ccc", width: "300px" }}
                        aria-label="Default select example" value={selectedLanguageListener} onChange={handleChangeListner}
                    >
                        <option value="">Select the language you want to listen</option>
                        {Array.from(languagesMap.entries()).map(([langKey, langName]) => (
                        <option key={langKey} value={langKey}>
                            {langName}
                        </option>
                        ))}
                    </select>



                    {/* Display Processed Audio */}
                    {processedAudioUrl && (
                        <div>
                            <h3>Processed Audio</h3>
                            <audio controls>
                                <source src={processedAudioUrl} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sender;

