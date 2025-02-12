import os
from google.cloud import texttospeech_v1

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "regal-eye-441814-q7-09e47b008f36.json" 
client = texttospeech_v1.TextToSpeechClient() 

text_french = "Hello How are you today?" 
text_sinhala = "ඔයාට අද කොහොම ද"

synthesis_input = texttospeech_v1.SynthesisInput(text=text_french)       


voice_1 = texttospeech_v1.VoiceSelectionParams(     
    language_code='en-US',                          
    ssml_gender=texttospeech_v1.SsmlVoiceGender.MALE
)


audio_config = texttospeech_v1.AudioConfig(               
    audio_encoding=texttospeech_v1.AudioEncoding.MP3
)

response = client.synthesize_speech(           
    input=synthesis_input,
    voice=voice_1,
    audio_config=audio_config
)

with open('french_audio.mp3', 'wb') as output:  
    output.write(response.audio_content)

print("French audio content written to file 'french_audio.mp3'")