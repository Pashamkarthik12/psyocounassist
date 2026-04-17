import React, { useState, useRef } from 'react';
import Navigation from '../components/Navigation';
import { Upload, Mic, Play, Download, Loader, AlertCircle, CheckCircle, Square, Circle } from 'lucide-react';
import { analyzeSpeech } from '../services/api';

const Speech = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
      setResult(null);
      setError(null);
      setRecordedAudioURL(null);
    }
  };

  // Convert audio blob to WAV format
  const convertToWav = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Convert to WAV
          const wavBlob = audioBufferToWav(audioBuffer);
          resolve(wavBlob);
        } catch (err) {
          reject(err);
        }
      };

      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(audioBlob);
    });
  };

  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (audioBuffer) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    let result;
    if (numOfChannels === 2) {
      result = interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1));
    } else {
      result = audioBuffer.getChannelData(0);
    }

    const buffer = new ArrayBuffer(44 + result.length * 2);
    const view = new DataView(buffer);

    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + result.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * bitDepth / 8, true);
    view.setUint16(32, numOfChannels * bitDepth / 8, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, result.length * 2, true);

    // Write audio data
    floatTo16BitPCM(view, 44, result);

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const interleave = (leftChannel, rightChannel) => {
    const length = leftChannel.length + rightChannel.length;
    const result = new Float32Array(length);

    let inputIndex = 0;
    for (let index = 0; index < length;) {
      result[index++] = leftChannel[inputIndex];
      result[index++] = rightChannel[inputIndex];
      inputIndex++;
    }
    return result;
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (view, offset, input) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use audio/webm for better browser compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        try {
          // Convert to WAV
          const wavBlob = await convertToWav(audioBlob);
          const audioURL = URL.createObjectURL(wavBlob);
          setRecordedAudioURL(audioURL);
          
          // Create File object from Blob
          const file = new File([wavBlob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
          setAudioFile(file);
          setAudioFileName(file.name);
          setResult(null);
          setError(null);
        } catch (err) {
          console.error('Error converting audio:', err);
          setError('Failed to convert audio to WAV format');
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Failed to access microphone. Please ensure microphone permissions are granted.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile) {
      setError('Please select or record an audio file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeSpeech(audioFile);
      setResult(data);
      
      // Save to localStorage for dashboard
      const analyses = JSON.parse(localStorage.getItem('speechAnalyses') || '[]');
      analyses.push({
        type: 'speech',
        emotion: data.emotion,
        confidence: data.confidence,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('speechAnalyses', JSON.stringify(analyses));
    } catch (err) {
      console.error('Error analyzing speech:', err);
      setError('Failed to analyze speech. Please ensure the Flask backend is running at http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result && result.pdf_file) {
      const link = document.createElement('a');
      link.href = `http://localhost:5000${result.pdf_file}`;
      link.download = 'speech_emotion_report.pdf';
      link.click();
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
    <Navigation />
    
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-4 rounded-full">
              <Mic className="w-10 h-10 text-teal-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Speech Emotion Recognition
          </h1>

          <p className="text-gray-600">
            Upload or record an audio file to analyze emotional content
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Recording Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Record Audio
              </label>

              <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">

                {!isRecording ? (
                  <>
                    <Circle className="w-12 h-12 text-purple-500 mx-auto mb-4" />

                    <button
                      type="button"
                      onClick={startRecording}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-flex items-center"
                      data-testid="start-recording-btn"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </button>

                    {recordedAudioURL && (
                      <p className="mt-4 text-sm text-gray-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Recording ready to analyze
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        <Circle className="w-12 h-12 text-red-500 animate-pulse" fill="currentColor" />
                      </div>
                    </div>

                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Recording...
                    </p>

                    <p className="text-2xl font-mono text-red-600 mb-4" data-testid="recording-timer">
                      {formatTime(recordingTime)}
                    </p>

                    <button
                      type="button"
                      onClick={stopRecording}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition inline-flex items-center"
                      data-testid="stop-recording-btn"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </button>
                  </>
                )}

              </div>
            </div>

             {/* Divider */}
<div className="flex items-center my-6">
  <div className="flex-1 border-t border-gray-300"></div>
  <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
  <div className="flex-1 border-t border-gray-300"></div>
</div>

{/* Upload Section */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    Upload Audio File (.wav)
  </label>

  <div className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
    <Upload className="w-12 h-12 text-teal-500 mx-auto mb-4" />

    <input
      type="file"
      accept=".wav,audio/wav"
      onChange={handleFileChange}
      className="hidden"
      id="audio-upload"
      data-testid="speech-audio-input"
    />

    <label
      htmlFor="audio-upload"
      className="cursor-pointer inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
    >
      Choose Audio File
    </label>

    {audioFileName && !recordedAudioURL && (
      <p className="mt-4 text-sm text-gray-600 flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
        Selected: {audioFileName}
      </p>
    )}

  </div>
</div>

{/* Playback for recorded audio */}
{recordedAudioURL && (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
    <p className="text-sm font-medium text-gray-700 mb-3">
      Preview Recording
    </p>

    <audio
      controls
      className="w-full"
      src={recordedAudioURL}
      data-testid="recorded-audio-player"
    >
      Your browser does not support the audio element.
    </audio>
  </div>
)}

{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start" data-testid="speech-error-message">
    <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
    <p className="text-red-700 text-sm">{error}</p>
  </div>
)}

<button
  type="submit"
  disabled={loading || !audioFile}
  className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
  data-testid="speech-submit-btn"
>
  {loading ? (
    <>
      <Loader className="w-5 h-5 mr-2 animate-spin" />
      Analyzing Speech...
    </>
  ) : (
    <>
      <Mic className="w-5 h-5 mr-2" />
      Analyze Speech Emotion
    </>
  )}
</button>
            </form>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Play className="w-6 h-6 text-teal-600 mr-2" />
                  Analysis Results
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
    <p className="text-sm text-gray-600 mb-2">Detected Emotion</p>
    <p className="text-3xl font-bold text-teal-700" data-testid="speech-emotion-result">
      {result.emotion}
    </p>
  </div>

  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
    <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
    <p className="text-3xl font-bold text-green-700" data-testid="speech-confidence-result">
      {result.confidence.toFixed(2)}%
    </p>
  </div>
</div>

{result.audio_file && (
  <div className="mb-6">
    <p className="text-sm font-medium text-gray-700 mb-3">Audio Playback</p>
    <audio
      controls
      className="w-full"
      src={`http://localhost:5000${result.audio_file}`}
      data-testid="speech-audio-player"
    >
      Your browser does not support the audio element.
    </audio>
  </div>
)}

</div>

<div className="bg-white rounded-2xl shadow-xl p-8">
  <h3 className="text-xl font-bold text-gray-800 mb-4">
    AI Recommendations
  </h3>

  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" data-testid="speech-recommendations">
    <p className="text-gray-700 whitespace-pre-wrap">
      {result.llm_output}
    </p>
  </div>
</div>

<div className="bg-white rounded-2xl shadow-xl p-8">
  <h3 className="text-xl font-bold text-gray-800 mb-4">
    Psychological Documentation
  </h3>

  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6" data-testid="speech-documentation">
    <p className="text-gray-700 whitespace-pre-wrap">
      {result.report_text}
    </p>
  </div>

  {result.pdf_file && (
    <button
      onClick={handleDownload}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
      data-testid="speech-download-btn"
    >
      <Download className="w-5 h-5 mr-2" />
      Download Full Report (PDF)
    </button>
  )}

</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Speech;
