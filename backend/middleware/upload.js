import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '..', 'uploads');
const mediaDir = path.join(uploadDir, 'media');
const voiceDir = path.join(uploadDir, 'voice');
const faceDir = path.join(uploadDir, 'faces');

[uploadDir, mediaDir, voiceDir, faceDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = mediaDir;
        
        if (file.fieldname === 'voice') {
            dest = voiceDir;
        } else if (file.fieldname === 'face_capture') {
            dest = faceDir;
        } else if (file.fieldname.startsWith('media_')) {
            dest = mediaDir;
        }
        
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|avi|mov|wmv|webm/;
    const allowedAudioTypes = /mp3|wav|ogg|m4a|webm/;
    
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                    allowedVideoTypes.test(path.extname(file.originalname).toLowerCase()) ||
                    allowedAudioTypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = /image|video|audio/.test(file.mimetype);
    
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image, video, and audio files are allowed'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
    },
    fileFilter: fileFilter
});

export default upload;
