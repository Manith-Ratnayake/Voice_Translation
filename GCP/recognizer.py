import speech_recognition as sr 


r = sr.Recognizer()
with sr.AudioFile("kaudio.mp3") as src:
    audio_text = r.listen(src)


r.recognize_google(audio_text, show_all=True)