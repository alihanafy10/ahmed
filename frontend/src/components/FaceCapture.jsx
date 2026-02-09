import { useState, useRef, useEffect, useCallback } from 'react';
import { FaCamera, FaCheck, FaRedo, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import * as faceapi from 'face-api.js';

const FaceCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          // faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load face detection models", err);
        setError("فشل تحميل نموذج التعرف على الوجه. يرجى التحقق من اتصال الإنترنت.");
      }
    };
    loadModels();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopCamera(); // Ensure any previous stream is stopped
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Use front camera
        audio: false
      });
      
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("تعذر الوصول للكاميرا. يرجى التأكد من السماح بالوصول.");
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Face Detection Loop
  useEffect(() => {
    let interval;
    if (isModelLoaded && videoRef.current && !capturedImage) {
        
        const detectFace = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                 const video = videoRef.current;
                 const overlay = overlayRef.current;
                 
                 // Detect faces
                 const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                 
                 // Update state
                 const hasFace = detections.length > 0;
                 setFaceDetected(hasFace);

                 // Draw overlay
                 if (overlay) {
                     const displaySize = { width: video.videoWidth, height: video.videoHeight };
                     faceapi.matchDimensions(overlay, displaySize);
                     const resizedDetections = faceapi.resizeResults(detections, displaySize);
                     
                     // Clear previous drawings
                     const context = overlay.getContext('2d');
                     context.clearRect(0, 0, overlay.width, overlay.height);
                     
                     // Flip horizontally context for drawing to match mirrored video
                     context.save();
                     context.translate(overlay.width, 0);
                     context.scale(-1, 1);
                     
                     // Draw detections
                     faceapi.draw.drawDetections(overlay, resizedDetections);
                     context.restore();
                 }
            }
        };

        interval = setInterval(detectFace, 200); // Check every 200ms
    }
    return () => clearInterval(interval);
  }, [isModelLoaded, videoRef, capturedImage]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Flip horizontally for mirror effect (if needed) - usually user expects mirror
      context.translate(canvas.width, 0);
      context.scale(-1, 1);

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageUrl);
      
      // Trigger flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }
  };

  const confirmCapture = () => {
    onCapture(capturedImage);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm z-10">
            <h2 className="text-xl font-bold text-white mb-2">التحقق من الهوية</h2>
            <p className="text-sm text-zinc-400">يرجى التقاط صورة لوجهك لتوثيق البلاغ</p>
        </div>

        {/* Camera Area */}
        <div className="relative aspect-[3/4] bg-black overflow-hidden">
            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-zinc-900/80 backdrop-blur">
                    <FaExclamationTriangle className="text-5xl text-amber-500 mb-4" />
                    <p className="text-red-400 font-bold mb-4">{error}</p>
                    <button 
                        onClick={startCamera}
                        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
                    >
                        المحاولة مرة أخرى
                    </button>
                </div>
            ) : (
                <>
                    {/* Live Video */}
                    <div className="relative w-full h-full">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className={`w-full h-full object-cover transform -scale-x-100 ${capturedImage ? 'hidden' : 'block'}`}
                        />
                        <canvas 
                            ref={overlayRef}
                            className={`absolute inset-0 w-full h-full pointer-events-none ${capturedImage ? 'hidden' : 'block'}`}
                            style={{ transform: 'scaleX(-1)' }} // Mirror the overlay too so it aligns with video
                        />
                    </div>
                    
                    {/* Captured Image Preview */}
                    {capturedImage && (
                        <img 
                            src={capturedImage} 
                            alt="Captured Face" 
                            className="w-full h-full object-cover absolute inset-0 z-10" 
                        />
                    )}

                    {/* Status/Guidelines Overlay */}
                    {!capturedImage && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8">
                             {/* Top Status */}
                            <div className={`mt-4 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                                isModelLoaded 
                                    ? (faceDetected ? 'bg-green-500/20 border-green-500/50 text-green-200' : 'bg-red-500/20 border-red-500/50 text-red-200')
                                    : 'bg-zinc-800/80 border-white/10 text-zinc-400'
                            }`}>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    {!isModelLoaded ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> جاري تحميل النموذج...
                                        </>
                                    ) : faceDetected ? (
                                        <>
                                            <FaCheck /> تم اكتشاف الوجه
                                        </>
                                    ) : (
                                        <>
                                            <FaExclamationTriangle /> وجه غير مكتشف
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Face Frame Guide */}
                            <div className={`w-64 h-80 border-2 rounded-[40%] transition-colors duration-300 ${
                                faceDetected ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-white/20'
                            }`} />
                            
                            {/* Bottom Instruction */}
                             <div className="mb-4 bg-zinc-900/80 text-white text-xs px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
                                ضع وجهك داخل الإطار
                            </div>
                        </div>
                    )}
                </>
            )}
            
            {/* Flash Effect */}
            {/* Flash Effect */}
            <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 z-50 ${showFlash ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Controls */}
        <div className="p-6 bg-zinc-900 border-t border-white/5">
            {!capturedImage ? (
                <div className="flex justify-center">
                    <button
                        onClick={capturePhoto}
                        disabled={!!error || !isModelLoaded || !faceDetected}
                        className="w-20 h-20 bg-white rounded-full border-4 border-zinc-300 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 group relative"
                        title={!faceDetected ? "يجب اكتشاف وجه أولاً" : "التقاط صورة"}
                    >
                        {!isModelLoaded ? (
                             <FaSpinner className="text-3xl text-zinc-900 animate-spin" />
                        ) : (
                             <FaCamera className="text-3xl text-zinc-900 group-disabled:opacity-50" />
                        )}
                        
                        {/* Tooltip for disabled state */}
                        {(!faceDetected && isModelLoaded) && (
                            <span className="absolute -top-10 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                لم يتم اكتشاف وجه
                            </span>
                        )}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={retakePhoto}
                        className="h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <FaRedo /> إعادة
                    </button>
                    <button
                        onClick={confirmCapture}
                        className="h-14 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                    >
                        <FaCheck /> متابعة
                    </button>
                </div>
            )}
        </div>

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default FaceCapture;
