import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaTrash } from 'react-icons/fa';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 100
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  
  // Audio Context Refs for Visualizer
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("متصفحك لا يدعم تسجيل الصوت.");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // --- Setup Visualizer ---
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((p, c) => p + c, 0) / bufferLength;
          setVolumeLevel(Math.round(average)); // Visualize average volume
          animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
      // ------------------------

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Cleanup Audio Context
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        setVolumeLevel(0);

        const type = mediaRecorderRef.current.mimeType;
        const audioBlob = new Blob(audioChunksRef.current, { type });
        
        console.log(`Blob size: ${audioBlob.size}, Type: ${type}`);
        
        if (audioBlob.size === 0) {
            alert("تسجيل فارغ!");
            return;
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          alert("يرجى السماح بالوصول للميكروفون لاستخدام هذه الميزة.");
      } else if (error.message === "متصفحك لا يدعم تسجيل الصوت.") {
          alert(error.message);
      } else {
          alert("تعذر الوصول للميكروفون. تأكد من توصيله بشكل صحيح.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    onRecordingComplete(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
        clearInterval(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-800/40 border border-white/5 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold text-zinc-200">تسجيل صوتي</span>
            {isRecording && (
                <div className="flex items-center gap-2">
                    {/* Volume Visualizer */}
                    <div className="flex items-end gap-0.5 h-4">
                        {[...Array(5)].map((_, i) => (
                             <div 
                                key={i} 
                                className={`w-1 rounded-t-sm transition-all duration-75 ${volumeLevel > (i * 10) ? 'bg-green-500' : 'bg-zinc-700'}`}
                                style={{ height: volumeLevel > (i * 10) ? `${Math.min(100, volumeLevel * 1.5)}%` : '20%' }}
                             />
                        ))}
                    </div>
                    <span className="text-xs text-red-400 font-mono font-bold tracking-widest ml-2">{formatTime(recordingTime)}</span>
                </div>
            )}
        </div>

      {!audioUrl ? (
        <div className="flex justify-center py-2">
            {isRecording ? (
                 <button
                 type="button"
                 onClick={stopRecording}
                 className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-900/20 transition-all active:scale-[0.98]"
               >
                 <FaStop /> <span className="font-bold text-lg">إيقاف التسجيل</span>
               </button>
            ) : (
                <button
                type="button"
                onClick={startRecording}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-all border border-zinc-600 hover:border-zinc-500 active:scale-[0.98]"
              >
                <FaMicrophone /> <span className="font-bold text-lg">بدء التسجيل</span>
              </button>
            )}
        </div>
      ) : (

        <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
            {/* Using native controls to ensure playback compatibility */}
             <audio 
                ref={audioRef} 
                src={audioUrl} 
                controls
                className="w-full h-8 accent-red-500" 
            />

          <button
            type="button"
            onClick={deleteRecording}
            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all shrink-0 border border-white/10"
            title="حذف التسجيل"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
