
import { useState, useEffect, useRef } from "react";

const Main = () => {
  const [audioPermission, setAudioPermission] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [stream, setStream] = useState(null);

  const recordButton = useRef(null);
  const stopButton = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setStream(stream);
          setAudioPermission(true);
          const recorder = new MediaRecorder(stream);

          recorder.ondataavailable = (e) => {
            setChunks((prevChunks) => [...prevChunks, e.data]);
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: "audio/wav" });
            const audioURL = URL.createObjectURL(audioBlob);
            console.log("Audio Recorded: ", audioURL);
          };

          setMediaRecorder(recorder);
        })
        .catch((err) => {
          alert("Error occurred in getUserMedia: " + err);
        });
    } else {
      alert("getUserMedia is not supported on this browser.");
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      setChunks([]); // Clear previous chunks
      mediaRecorder.start();
      console.log("Recording started...");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log("Recording stopped.");
    }
  };

  return (
    <div>
    <h1>Hello World</h1>
      <button ref={recordButton} onClick={startRecording}>
        Start Recording
      </button>
      <button ref={stopButton} onClick={stopRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default Main;
