/**
 * File Helper Utility
 * Generates URLs for uploaded files
 */

/**
 * Generate a file URL from the file path
 * @param {string} filePath - The full file path from multer
 * @param {object} req - Express request object (optional, for generating full URL)
 * @returns {string} - The file URL
 */
export const generateFileUrl = (filePath, req = null) => {
    if (!filePath) return null;
    
    // Extract the relative path from uploads directory
    const uploadsIndex = filePath.indexOf('uploads');
    if (uploadsIndex === -1) {
        // If 'uploads' not found in path, assume it's already a relative path
        return `/uploads/${filePath}`;
    }
    
    // Get everything after 'uploads'
    const relativePath = filePath.substring(uploadsIndex + 'uploads'.length);
    const url = `/uploads${relativePath}`.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    
    // If request object is provided, generate full URL
    if (req) {
        const protocol = req.protocol;
        const host = req.get('host');
        return `${protocol}://${host}${url}`;
    }
    
    return url;
};

/**
 * Process file object to extract URL
 * @param {object} file - Multer file object
 * @param {object} req - Express request object (optional)
 * @returns {object} - File object with URL instead of path
 */
export const processFileForStorage = (file, req = null) => {
    if (!file) return null;
    
    return {
        filename: file.filename,
        url: generateFileUrl(file.path, req),
        mimetype: file.mimetype,
        size: file.size
    };
};

/**
 * Process multiple files
 * @param {array} files - Array of multer file objects
 * @param {object} req - Express request object (optional)
 * @returns {array} - Array of file objects with URLs
 */
export const processFilesForStorage = (files, req = null) => {
    if (!files || files.length === 0) return [];
    
    return files.map(file => processFileForStorage(file, req));
};
