import boto3
import asyncio
import pyaudio
import concurrent
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent

polly = boto3.client('polly', region_name = 'us-west-2')
translate = boto3.client(service_name='translate', region_name='us-west-2', use_ssl=True)
pa = pyaudio.PyAudio()

# for mic stream, 1024 should work fine
default_frames = 1024

# current params are set up for English to Mandarin, modify to your liking
params = {}
params['source_language'] = "en"
params['target_language'] = "zh"
params['lang_code_for_polly'] = "cmn-CN"
params['voice_id'] = "Zhiyu"
params['lang_code_for_transcribe'] = "en-US"





# try grabbing the default input device and see if we get lucky
default_input_device = pa.get_default_input_device_info()
# verify this is your microphone device 
#print(default_input_device)
# if correct then set it as your input device and define some globals
input_device = default_input_device
input_channel_count = input_device["maxInputChannels"]
input_sample_rate = input_device["defaultSampleRate"]
input_dev_index = input_device["index"]
##### BLOCK OPTIONAL #####
#print ("Available devices:\n")
for i in range(0, pa.get_device_count()):
    info = pa.get_device_info_by_index(i)
    #print (str(info["index"])  + ": \t %s \n \t %s \n" % (info["name"], pa.get_host_api_info_by_index(info["hostApi"])["name"]))

# select the correct index from the above returned list of devices, for example zero
dev_index = 0 
input_device = pa.get_device_info_by_index(dev_index)







#print ("Available devices:\n")
for i in range(0, pa.get_device_count()):
    info = pa.get_device_info_by_index(i)
    #print (str(info["index"])  + ": \t %s \n \t %s \n" % (info["name"], pa.get_host_api_info_by_index(info["hostApi"])["name"]))



# select the correct index from the above returned list of devices, for example zero
dev_index = 0 
input_device = pa.get_device_info_by_index(dev_index)

#set globals for microphone stream
input_channel_count = input_device["maxInputChannels"]
input_sample_rate = input_device["defaultSampleRate"]
input_dev_index = input_device["index"]




# text will come from MyEventsHandler
def aws_polly_tts(text):
    response = polly.synthesize_speech(
        Engine = 'standard',
        LanguageCode = params['lang_code_for_polly'],
        Text = text,
        VoiceId = params['voice_id'],
        OutputFormat = "pcm",
    )
    output_bytes = response['AudioStream']

    #play to the speakers
    write_to_speaker_stream(output_bytes)

# how to write audio bytes to speakers
def write_to_speaker_stream(output_bytes):
    # Consumes bytes in chunks to produce the response's output
    print("Streaming started...")
    chunk_len = 1024
    channels = 2
    sample_rate = 16000

    if output_bytes:
        polly_stream = pa.open(
                    format = pyaudio.paInt16,
                    channels = channels,
                    rate = sample_rate,
                    output = True,
                    )

        # this is a blocking call - will sort this out with concurrent later
        while True:
            data = output_bytes.read(chunk_len)
            polly_stream.write(data)

        # If there's no more data to read, stop streaming
            if not data:
                output_bytes.close()
                polly_stream.stop_stream()
                polly_stream.close()
                break
        print("Streaming completed.")
    else:
        print("Nothing to stream.")






# use concurrent package to create an executor object with 3 workers ie threads
executor = concurrent.futures.ThreadPoolExecutor(max_workers=3)
class MyEventHandler(TranscriptResultStreamHandler):
    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        # If the transcription is finalized, send it to translate
        results = transcript_event.transcript.results
        if len(results) > 0:
            if len(results[0].alternatives) > 0:
                transcript = results[0].alternatives[0].transcript
                print("transcript:", transcript)
                print(results[0].channel_id)

                # See partial results: https://docs.aws.amazon.com/transcribe/latest/dg/streaming-partial-results.html
                if hasattr(results[0], "is_partial") and results[0].is_partial == False:
                    # translate only 1 channel. the other channel is a duplicate
                    if results[0].channel_id == "ch_0":
                        trans_result = translate.translate_text(
                            Text = transcript,
                            SourceLanguageCode = params['source_language'],
                            TargetLanguageCode = params['target_language']
                        )
                        print("translated text:" + trans_result.get("TranslatedText"))
                        text = trans_result.get("TranslatedText")

                        # we run aws_polly_tts with a non-blocking executor at every loop iteration
                        await loop.run_in_executor(executor, aws_polly_tts, text)




async def loop_me():
    # Setup up our client with our chosen AWS region
    client = TranscribeStreamingClient(region="ap-south-1")
    stream = await client.start_stream_transcription(
        language_code=params['lang_code_for_transcribe'],
        media_sample_rate_hz=int(input_sample_rate),
        number_of_channels = 2,
        enable_channel_identification=True,
        media_encoding="pcm",
    )

    recorded_frames = []
    async def write_chunks(stream):
        # This connects the raw audio chunks generator coming from the microphone
        # and passes them along to the transcription stream.
        print("getting mic stream")
        async for chunk in mic_stream():
            recorded_frames.append(chunk)
            await stream.input_stream.send_audio_event(audio_chunk=chunk)
        await stream.input_stream.end_stream()

    handler = MyEventHandler(stream.output_stream)
    await asyncio.gather(write_chunks(stream), handler.handle_events())

# write a proper while loop here
loop = asyncio.get_event_loop()
loop.run_until_complete(loop_me())
loop.close()  