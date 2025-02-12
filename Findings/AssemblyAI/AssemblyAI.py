import assemblyai as aai


aai.settings.api_key = '' 
FILE_URL = '.\\maudio.mp3'  


transcriber = aai.Transcriber()
transcript = transcriber.transcribe(FILE_URL)


if transcript.status == aai.TranscriptStatus.error:
    print(transcript.error)

else:
    print(transcript.text)
