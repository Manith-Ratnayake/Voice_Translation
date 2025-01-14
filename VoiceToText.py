import io 
from google.oauth2 import service_account
from google.cloud import speech


client_file = 'regal-eye-441814-q7-09e47b008f36.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials = credentials)


audio_file = "someaudio.wav"

with io.open(audio_file, "rb") as f:
    content = f.read()
    audio = speech.RecognitionAudio(content=content)


config = speech.RecognitionConfig(
    encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz = 8000,
    language_code = 'en-US'
)

response = client.recognize(config=config, audio=audio)
print(response)



