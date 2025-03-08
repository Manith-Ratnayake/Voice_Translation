import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";


const client = new TranslateClient({
    region: "ap-south-1", 
});



export const translateText = async (text, sourceLang, targetLang, maxRetries = 10, delay = 2000) => {
    if (!text || text.trim() === "") {
        console.error("Empty text received for translation.");
        return null;
    }

    const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: sourceLang,
        TargetLanguageCode: targetLang,
    });

    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const response = await client.send(command);
            if (response.TranslatedText && response.TranslatedText.trim() !== "") {
                console.log(`Translated Text: ${response.TranslatedText}`);
                return response.TranslatedText; // Return translated text once it's available
            }
        } catch (error) {
            console.error(`Translation attempt ${attempt + 1} failed:`, error);
        }

        attempt++;
        if (attempt < maxRetries) {
            console.log(`Retrying translation in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
        }
    }

    console.error("Translation failed after maximum retries.");
    return null; // Return null if translation is still unavailable after retries
};

























/*
export const translateText =  async(text, sourceLang, targetLang) => {
    const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: sourceLang,
        TargetLanguageCode: targetLang, 
    });

    try {
        const response = await client.send(command);
        console.log(`Translated Text: ${response.TranslatedText}`);
    } catch (error) {
        console.error("Translation Error:", error);
    }
}*/
