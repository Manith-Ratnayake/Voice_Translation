import os
from google.cloud import texttospeech_v1

# Set the correct environment variable for credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "regal-eye-441814-q7-09e47b008f36.json"

# Initialize the Text-to-Speech client
client = texttospeech_v1.TextToSpeechClient()

# The French text to synthesize
text = "Bonjour, comment ça va?"

# Set the text input
synthesis_input = texttospeech_v1.SynthesisInput(text=text)

# Select the voice for French
voice_1 = texttospeech_v1.VoiceSelectionParams(
    language_code='fr-FR',  # French locale
    ssml_gender=texttospeech_v1.SsmlVoiceGender.MALE
)

# Configure the audio output
audio_config = texttospeech_v1.AudioConfig(
    audio_encoding=texttospeech_v1.AudioEncoding.MP3
)

# Perform the text-to-speech request
response = client.synthesize_speech(
    input=synthesis_input,
    voice=voice_1,
    audio_config=audio_config
)

# Save the audio content to a file
with open('french_audio.mp3', 'wb') as output:
    output.write(response.audio_content)

print("French audio content written to file 'french_audio.mp3'")
