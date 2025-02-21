import React, { useState, useRef, useEffect } from "react";
import { languagesMap } from './languages';
import io from "socket.io-client";

const hostingIpAddress = "43.205.77.134";
const socket = io(`https://${hostingIpAddress}:3000`, {
    transports: ["websocket", "polling"],
    secure: true,
});

const Sender = () => {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [processedAudioUrl, setProcessedAudioUrl] = useState(null);

    const [selectedLanguageSender, setSelectedLanguageSender] = useState("");
    const [selectedLanguageListener, setSelectedLanguageListener] = useState("");
    const [yourIp, setYourIP] = useState("");
    const [listenerIp, setListenerIp] = useState("");

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Fetch user's IP address
    useEffect(() => {
        fetch("https://api.ipify.org?format=json")
            .then(response => response.json())
            .then(data => setYourIP(data.ip))
            .catch(error => console.error("Error fetching IP:", error));
    }, []);

    useEffect(() => {
        if (yourIp) {
            sendMessageDatabase(yourIp);
        }
    }, [yourIp]);

    // Function to send IP to database
    const sendMessageDatabase = async (ip) => {
        try {
            const response = await fetch(`https://${hostingIpAddress}:3000/database`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ yourIp: ip }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const text = await response.json();
            console.log("Database Response:", text.message[0].ip);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Get microphone permission
    const getMicrophonePermission = async () => {
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setPermission(true);
            setStream(streamData);
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
        }
    };

    // Start recording
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

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Handle audio upload
    const handleAudioFile = async (audioBlob) => {
        console.log("Uploading Audio File:", audioBlob);

        const formData = new FormData();
        const now = new Date();

        formData.append("audio", audioBlob, `${yourIp}_${now.toISOString()}.wav`);
        formData.append("listenerIpAddress", listenerIp);
        formData.append("languageSender", selectedLanguageSender);
        formData.append("languageListener", selectedLanguageListener);

        try {
            const response = await fetch(`https://${hostingIpAddress}:3000/uploads`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const audioBlobResponse = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlobResponse);
                setProcessedAudioUrl(audioUrl);
                console.log("Processed Audio is ready!");

                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                console.log("Server Response:", await response.text());
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Handle incoming audio from socket
    useEffect(() => {
        const handleAudio = ({ audio }) => {
            const audioElement = new Audio(audio);
            audioElement.play();
        };

        socket.on("receive-audio", handleAudio);

        return () => {
            socket.off("receive-audio", handleAudio);
        };
    }, []);

    // Send audio via WebSocket
    const sendAudioToServer = (audioBlob) => {
        if (!socket.connected) {
            console.error("Socket is not connected!");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            socket.emit("send-audio", {
                audio: reader.result,
                targetIP: listenerIp,
                languageSender: selectedLanguageSender,
                languageListener: selectedLanguageListener,
            });
        };
    };

    return (
        <>
            <div>
                <label htmlFor="listener-ip">Enter Listener IP Address (Public):</label>
                <input
                    type="text"
                    id="listener-ip"
                    className="form-control"
                    placeholder="Enter Listener IP"
                    value={listenerIp}
                    onChange={(e) => setListenerIp(e.target.value)}
                />
            </div>

            <div>
                <h2>Your IP: {yourIp}</h2>
                <select value={selectedLanguageSender} onChange={(e) => setSelectedLanguageSender(e.target.value)}>
                    <option value="">Select your language</option>
                    {Array.from(languagesMap.entries()).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>

                {!permission ? <button onClick={getMicrophonePermission}>Get Microphone</button> : null}
                {permission && !isRecording ? <button onClick={startRecording}>Start Recording</button> : null}
                {isRecording ? <button onClick={stopRecording}>Stop Recording</button> : null}

                {audioUrl && (
                    <div>
                        <h3>Recorded Audio</h3>
                        <audio controls>
                            <source src={audioUrl} type="audio/webm" />
                        </audio>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sender;


