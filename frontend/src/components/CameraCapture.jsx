import { useState, useRef } from 'react';
import { FaCamera, FaVideo, FaTrash, FaRedo } from 'react-icons/fa';

const CameraCapture = ({ onFileSelected }) => {
  const [mediaItems, setMediaItems] = useState([]); // Array of { file, url, type }
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newItems = files.map(file => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));
      
      const updatedItems = [...mediaItems, ...newItems];
      setMediaItems(updatedItems);
      onFileSelected(updatedItems.map(item => item.file)); // Return array of files
    }
  };

  const removeFile = (index) => {
    const updatedItems = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updatedItems);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    onFileSelected(updatedItems.map(item => item.file));
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mediaItems.map((item, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden border border-zinc-700 shadow-md bg-black group aspect-square">
                {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                    <img src={item.url} alt={`Capture ${index}`} className="w-full h-full object-cover" />
                )}
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button
                        onClick={() => removeFile(index)}
                        type="button"
                        className="p-3 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                        title="Remove"
                    >
                        <FaTrash size={14} />
                    </button>
                </div>
                
                 {/* Video Indicator */}
                 {item.type === 'video' && (
                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
                        <FaVideo /> Video
                    </div>
                )}
            </div>
        ))}

        {/* Add Button */}
        <button
          type="button"
          onClick={triggerInput}
          className="aspect-square border-2 border-dashed border-zinc-700 hover:border-red-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-white transition-all bg-zinc-800/20 hover:bg-zinc-800/40 group cursor-pointer"
        >
          <div className="p-3 bg-zinc-800 group-hover:bg-red-600 rounded-full transition-all group-hover:scale-110 duration-300 shadow-lg">
            <FaCamera className="text-xl" />
          </div>
          <span className="text-xs font-bold text-center px-2">
              {mediaItems.length > 0 ? 'إضافة المزيد' : 'التقاط صور/فيديو'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
