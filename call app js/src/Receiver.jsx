import { useState, useEffect } from "react";

function Receiver() {
    const [audioSrc, setAudioSrc] = useState("");

    useEffect(() => {

        const fetchAudio = async () => {
            try {
                const response = await fetch("http://localhost:3000/processed/someaudio.mp3");
                if (!response.ok) {
                    throw new Error("Failed to fetch audio");
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setAudioSrc(url);
            } catch (error) {
                console.error("Error fetching audio:", error);
            }
        };

        fetchAudio();
    }, []);

    return (
        <>
            <h1>Listener</h1>
            {audioSrc && (
                <audio controls autoPlay>
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}

            <p>Speaking in {} language</p>
        </>
    );
}

export default Receiver;
