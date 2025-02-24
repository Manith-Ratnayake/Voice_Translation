


export const AudioRecording = () => {
  
  
     const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    //const [audioUrl, setAudioUrl] = useState(null);

    //const [selectedLanguageSender, setSelectedLanguageSender] = useState("");
    //const [selectedLanguageListener, setSelectedLanguageListener] = useState("");

    //const [processedAudioUrl, setProcessedAudioUrl] = useState(null); 
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);




  
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

    // Stop the audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

}


export default  AudioRecording;
