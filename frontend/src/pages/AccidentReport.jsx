import { useState } from 'react';
import { FaPaperPlane, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LocationCapture from '../components/LocationCapture';
import CameraCapture from '../components/CameraCapture';
import VoiceRecorder from '../components/VoiceRecorder';

const AccidentReport = ({ capturedFace }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [voice, setVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    
    // Append User Data
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user) {
        formData.append('reporter_name', user.fullName || '');
        formData.append('reporter_nationalId', user.nationalId || '');
        formData.append('reporter_phone', user.phone || '');
        formData.append('reporter_email', user.email || '');
    }
    if(location) formData.append('location', JSON.stringify(location));
    
    // Append all media files
    mediaFiles.forEach((file, index) => {
        formData.append(`media_${index}`, file);
    });

    if (capturedFace) formData.append('face_capture', capturedFace);

    if(voice) formData.append('voice', voice);
    formData.append('description', description);

    // Simulate API call
    console.log("Submitting Form Data:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black opacity-50" />
            
            <div className="relative z-10 animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-tr from-green-600 to-emerald-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl shadow-green-900/30">
                    <FaPaperPlane className="text-4xl text-white" />
                </div>
                <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">تم الإرسال بنجاح!</h2>
                <p className="text-zinc-400 max-w-sm mx-auto mb-10 text-lg">
                    تم استلام بلاغك وتحديد موقعك بدقة. فريق الاستجابة في الطريق إليك.
                </p>
                <Link to="/" className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white px-10 py-4 rounded-2xl font-bold transition-all border border-zinc-700 hover:scale-105">
                    العودة للرئيسية
                </Link>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20 selection:bg-red-500/30">
        {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-all">
                    <FaArrowRight />
                </Link>
                <h1 className="text-xl font-bold tracking-tight">إبلاغ عن حادث</h1>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Warning Banner */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-start gap-4 mb-8 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
           <FaExclamationCircle className="text-amber-500 text-2xl mt-0.5 ml-2 shrink-0" />
           <div>
               <h3 className="text-base font-bold text-amber-500 mb-1">حالة طارئة جداً؟</h3>
               <p className="text-sm text-amber-500/80 leading-relaxed">
                   في حال وجود إصابات خطيرة، <span className="font-bold underline decoration-amber-500/50">يرجى التوضيح في التفاصيل أدناه</span> ليتم تجهيز الفريق الطبي المناسب.
               </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column (Inputs) */}
            <div className="space-y-8">
                {/* Section 1: Location */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3 pr-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs">١</span>
                        الموقع الجغرافي
                    </h2>
                    <LocationCapture onLocationCaptured={setLocation} />
                </section>

                {/* Section 2: Visual Evidence */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3 pr-1 flex items-center gap-2">
                         <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs">٢</span>
                        الصور والفيديو
                    </h2>
                    <CameraCapture onFileSelected={setMediaFiles} />
                </section>
            </div>

            {/* Right Column (Description & Submit) */}
            <div className="space-y-8 lg:mt-0">
                 {/* Section 3: Description */}
                 <section className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3 pr-1 flex items-center gap-2">
                         <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs">٣</span>
                        تفاصيل الحادث
                    </h2>
                    <div className="space-y-4">
                         <VoiceRecorder onRecordingComplete={setVoice} />
                         
                         <div className="relative group">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="اكتب تفاصيل إضافية هنا (عدد المركبات، نوع الإصابات، إلخ)..."
                                className="w-full bg-zinc-800/20 border border-white/5 rounded-2xl p-5 text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:bg-zinc-800/40 focus:ring-4 focus:ring-red-500/10 transition-all resize-none h-48 shadow-inner"
                            />
                         </div>
                    </div>
                </section>

                 {/* Submit */}
                 <div className="pt-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-lg py-5 rounded-2xl transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 active:scale-[0.99]"
                    >
                        {isSubmitting ? (
                            <>
                                <FaPaperPlane className="animate-ping absolute ml-8 opacity-50" />
                                <span>جاري الإرسال...</span>
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="text-xl ml-2 group-hover:-translate-x-1 transition-transform " /> 
                                إرسال البلاغ الآن
                            </>
                        )}
                    </button>
                    <p className="text-center text-zinc-600 text-xs mt-4">
                        بإرسال هذا النموذج، أنت توافق على مشاركة موقعك وبياناتك مع جهات الاختصاص.
                    </p>
                 </div>
            </div>
        </form>
      </main>
    </div>
  );
};

export default AccidentReport;
