# from speechbrain.inference import EncoderDecoderASR

# asr_model = EncoderDecoderASR.from_hparams(source="speechbrain/asr-conformer-transformerlm-librispeech", savedir="pretrained_models/asr-transformer-transformerlm-librispeech")
# asr_model.transcribe_file("someaudio.wav")

# from speechbrain.pretrained import EncoderDecoderASR
import speechbrain
from speechbrain.inference import EncoderDecoderASR


asr_model = EncoderDecoderASR.from_hparams(source="speechbrain/asr-crdnn-rnnlm-librispeech", savedir="tmpdir")
text = asr_model.transcribe_file("bonvoyage_sinhala.mp3")
print(text)
