import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can add to home screen
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setIsVisible(false);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        // Show the prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] animate-bounce">
            <button
                onClick={handleInstallClick}
                className="group flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-2xl shadow-2xl transition-all transform active:scale-95 border border-blue-600/50 backdrop-blur-sm"
                aria-label="تثبيت التطبيق"
            >
                <div className="bg-white/20 p-2 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <span className="hidden group-hover:block font-medium text-sm px-1 ml-1 transition-all duration-300">
                    تثبيت
                </span>
            </button>
        </div>
    );
};

export default InstallPrompt;
