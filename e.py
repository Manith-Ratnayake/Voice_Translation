




import os
from google.cloud import texttospeech

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'regal-eye-441814-q7-09e47b008f36.json'
client = texttospeech.TextToSpeechClient()


text_to_voice_input = "Hello World"
synthesis_input = texttospeech.SynthesisInput(text = text_to_voice_input)


voice = texttospeech.VoiceSelectionParams(
    language_code = "sinhala",
    name = 'en-US-Studio-O'
)

audio_config = texttospeech.AudioConfig (
    audio_encoding = texttospeech.AudioEncoding.MP3,
    effects_profile_id = ['small-bluetooth-speaker-class-device'],
    speaking_rate = 1,
    pitch = 1
)


response = client.synthesize_speech(
    input = synthesis_input,
    voice = voice,
    audio_config = audio_config
)


with open("output.mp3", "wb") as output:
    output.write(response.audio_content)
    print("Audio Content is writing")