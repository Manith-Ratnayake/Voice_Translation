import os
from google.cloud import texttospeech_v1

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "regal-eye-441814-q7-09e47b008f36.json" # Set the correct environment variable for credentials
client = texttospeech_v1.TextToSpeechClient() # Initialize the Text-to-Speech client

text = "Bonjour, comment ça va?"             # The French text to synthesize
synthesis_input = texttospeech_v1.SynthesisInput(text=text)         # Set the text input


voice_1 = texttospeech_v1.VoiceSelectionParams(      # Select the voice for French
    language_code='fr-FR',                           # French locale
    ssml_gender=texttospeech_v1.SsmlVoiceGender.MALE
)


audio_config = texttospeech_v1.AudioConfig(               # Configure the audio output
    audio_encoding=texttospeech_v1.AudioEncoding.MP3
)

response = client.synthesize_speech(           # Perform the text-to-speech request
    input=synthesis_input,
    voice=voice_1,
    audio_config=audio_config
)

with open('french_audio.mp3', 'wb') as output:  # Save the audio content to a file
    output.write(response.audio_content)

print("French audio content written to file 'french_audio.mp3'")