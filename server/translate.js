import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";


const client = new TranslateClient({
    region: "ap-south-1", 
});


async function translateText(text, sourceLang, targetLang) {
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
}


translateText("Hello, how are you?", "en", "es"); 
