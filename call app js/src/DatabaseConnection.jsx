import React, { useState } from "react";

function DatabaseConnection() {
    
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


    
    


    return (

        <>
        <button onClick={sendMessage} className="btn btn-secondary">Click me</button>
        <select 
            className="form-select" 
            style={{ backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ccc", width: "300px" }} 
            aria-label="Default select example" value={selectedLanguage}  onChange={handleChange} size={5}>

                <option value="">Select the language you speaking</option>
                
                {languages.map((lang, index) => (
                    <option key={index} value={lang}>{lang}</option>
                ))}

            </select>

            <p>Selected Language : {selectedLanguage}</p>

        </>
    );



   



}

export default DatabaseConnection;