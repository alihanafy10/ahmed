import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-zinc-950">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-900/40">
        <div className="flex flex-col items-center gap-6 mb-10">
           
            
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent py-2">
                    سلامتكم أولاً
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl font-medium">
                    نظام الإبلاغ الفوري عن الحوادث
                </p>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                    ساهم في إنقاذ الأرواح من خلال الإبلاغ السريع والدقيق.
                </p>
            </div>
        </div>

        <Link 
            to="/report" 
            className="group relative block w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 text-xl">إبلاغ عن حادث جديد</span>
        </Link>
     </div>
  </div>
  )
}
