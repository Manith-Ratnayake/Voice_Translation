





from google.cloud import texttospeech
import os

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'regal-eye-441814-q7-09e47b008f36.json'

# Initialize the client
client = texttospeech.TextToSpeechClient()

# List all available voices
response = client.list_voices()

# Print details of each voice
print("Available Languages and Voices:")
available_languages = set()
for voice in response.voices:
    for language_code in voice.language_codes:
        available_languages.add(language_code)
        print(f"Language: {language_code}, Voice: {voice.name}, Gender: {voice.ssml_gender}, Sample Rate: {voice.natural_sample_rate_hertz} Hz")

print("\nUnique Languages Supported:")
for language in sorted(available_languages):
    print(language)
