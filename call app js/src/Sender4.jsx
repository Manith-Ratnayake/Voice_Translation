import {useState, useRef} from 'react';


export default function AudioRecord () {


    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

  
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

    
    return (
      <>
          
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


                
      </>
    )

}

