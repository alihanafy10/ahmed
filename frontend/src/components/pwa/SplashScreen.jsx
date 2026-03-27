import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
    const [show, setShow] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Simulating app readiness
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Complete removal from DOM after transition
            setTimeout(() => {
                setShow(false);
            }, 600); // matches the duration of transition
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative flex flex-col items-center gap-8">
                {/* Logo with subtle pulse */}
                <div className="w-32 h-32 md:w-48  relative animate-pulse">
                    <img 
                        src="/Image/logo.png" 
                        alt="سلامتكم أولاً" 
                        className="w-full h-full object-contain drop-shadow-xl"
                    />
                </div>

                {/* Text Content */}
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">تبليغ سريع وآمن</h1>
                    <div className="flex items-center justify-center gap-1 text-blue-600 font-medium tracking-wide">
                        <span>جاري تحميل النظام</span>
                        <span className="flex gap-1 mt-1 font-bold">
                            <span className="animate-bounce delay-0 text-xl">.</span>
                            <span className="animate-bounce delay-200 text-xl">.</span>
                            <span className="animate-bounce delay-500 text-xl">.</span>
                        </span>
                    </div>
                </div>

                {/* Progress indicator (optional but professional) */}
                <div className="absolute -bottom-16 w-48 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite] rounded-full" />
                </div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { width: 0%; left: 0%; }
                    50% { width: 40%; left: 30%; }
                    100% { width: 0%; left: 100%; }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
