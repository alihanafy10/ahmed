// Egyptian Governorates
export const GOVERNORATES = [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'الدقهلية',
    'البحر الأحمر',
    'البحيرة',
    'الفيوم',
    'الغربية',
    'الإسماعيلية',
    'المنوفية',
    'المنيا',
    'القليوبية',
    'الوادي الجديد',
    'الشرقية',
    'السويس',
    'أسوان',
    'أسيوط',
    'بني سويف',
    'بورسعيد',
    'دمياط',
    'الأقصر',
    'قنا',
    'كفر الشيخ',
    'مطروح',
    'سوهاج',
    'شمال سيناء',
    'جنوب سيناء'
];

// Report Status
export const REPORT_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
};

// Report Priority
export const REPORT_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

// User Roles
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

// File Upload Settings
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
    ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/webm']
};

// Critical keywords for priority detection
export const CRITICAL_KEYWORDS = [
    'إصابة خطيرة',
    'وفاة',
    'حريق',
    'انفجار',
    'طوارئ',
    'نزيف',
    'فاقد الوعي'
];

export const HIGH_PRIORITY_KEYWORDS = [
    'إصابة',
    'مصاب',
    'دماء',
    'جريح',
    'كسر'
];
