import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const LocationCapture = ({ onLocationCaptured }) => {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const getLocation = () => {
    setStatus('loading');
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const locationData = { latitude, longitude, accuracy };
        setCoords(locationData);
        setStatus('success');
        onLocationCaptured(locationData);
      },
      (error) => {
        setStatus('error');
        setErrorMsg('Unable to retrieve location. Please check permissions.');
        console.error("Location error:", error);
      },
      { enableHighAccuracy: true } // Request best possible results
    );
  };

  // Auto-capture on mount
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="bg-zinc-800/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg backdrop-blur-sm hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner-lg ${status === 'success' ? 'bg-green-500/20 text-green-400' : status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
          <FaMapMarkerAlt />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-zinc-100">الموقع الحالي</span>
          {status === 'loading' && <span className="text-xs text-blue-400 animate-pulse font-medium">جاري التحديد...</span>}
          {status === 'success' && coords && (
            <span className="text-xs text-zinc-400 font-mono tracking-wider bg-black/20 px-2 py-0.5 rounded-md mt-1 border border-white/5 inline-block">
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </span>
          )}
          {status === 'error' && <span className="text-xs text-red-400 font-medium">فشل التحديد</span>}
        </div>
      </div>

      <div className="flex items-center">
         {status === 'loading' && <FaSpinner className="animate-spin text-zinc-500 text-xl" />}
         {status === 'success' && <FaCheckCircle className="text-green-500 text-2xl drop-shadow-md" />}
         {status === 'error' && (
            <button 
                onClick={getLocation} 
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-all font-medium border border-zinc-600 shadow-sm"
                type="button"
            >
                إعادة
            </button>
         )}
      </div>
    </div>
  );
};

export default LocationCapture;
