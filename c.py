import os
from unicodedata import name
from urllib import response
from google.cloud import texttospeech_v1

os.environ['GOOGLE_APPLICATION_CREDENTIAL'] = 'regal-eye-4418'

text = "HI whats up"

synthesis_input = texttospeech_v1.SynthesisInput( text = text)

voice_1 = texttospeech_v1.VoiceSelectionParams (
    language_code = 'en-in'
    ssml_gender = texttospeech_v1.SsmlVoiceGender.Male
)


voice_2 = texttospeech_v1.VoiceSelectionParams (
    language_code = 'en-in'
    ssml_gender = texttospeech_v1.SsmlVoiceGender.Male
)

print(client.list_voices)
audio_config = texttospeech_v1.Audio_config(
    audio_encoding = texttospeech_v1.AudioEncoding.MP3
)


response = client.synthesis_speech (
    input = synthesis_input,
    voice = voice1,
    audio_config = audio_config
)

with open('audio.mp3', 'wb') as output:
    output.write(response1.audio_content)


