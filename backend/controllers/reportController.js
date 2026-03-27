import { validationResult } from 'express-validator';
import AccidentReport from '../models/AccidentReport.js';
import { processFileForStorage } from '../utils/fileHelper.js';

// @desc    Create new accident report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    }

    try {
        console.log('📝 Creating report...');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const { description, location } = req.body;

        // Parse location if it's a string
        let locationData;
        if (typeof location === 'string') {
            locationData = JSON.parse(location);
        } else {
            locationData = location;
        }

        // Prepare report data
        const reportData = {
            reporter: req.user._id,
            reporterInfo: {
                name: req.user.fullName,
                nationalId: req.user.nationalId,
                phone: req.user.phone,
                email: req.user.email
            },
            description,
            location: {
                type: 'Point',
                coordinates: [locationData.longitude, locationData.latitude],
                address: locationData.address || '',
                accuracy: locationData.accuracy || 0
            }
        };

        // Handle media files
        if (req.files) {
            console.log('📎 Files received:', Object.keys(req.files));
            console.log('📎 Full req.files object:', JSON.stringify(req.files, null, 2));
            const mediaFiles = [];
            
            // Process media files (media_0, media_1, etc.)
            Object.keys(req.files).forEach(fieldname => {
                if (fieldname.startsWith('media_')) {
                    const file = req.files[fieldname][0];
                    console.log(`  Processing ${fieldname}:`, file.filename, file.size, 'bytes');
                    const fileData = processFileForStorage(file, req);
                    console.log(`  Generated URL:`, fileData.url);
                    mediaFiles.push(fileData);
                }
            });

            reportData.mediaFiles = mediaFiles;
            console.log('📸 Media files processed:', mediaFiles.length);
            console.log('📸 Media files array:', JSON.stringify(mediaFiles, null, 2));

            // Process voice recording
            if (req.files.voice) {
                const voiceFile = req.files.voice[0];
                reportData.voiceRecording = processFileForStorage(voiceFile, req);
                console.log('🎤 Voice recording processed:', voiceFile.filename);
            }

            // Process face capture
            if (req.files.face_capture) {
                const faceFile = req.files.face_capture[0];
                reportData.faceCapture = processFileForStorage(faceFile, req);
                console.log('👤 Face capture processed:', faceFile.filename);
            }
        } else {
            console.log('⚠️ No files received in request');
        }

        // Determine priority based on keywords in description
        const criticalKeywords = ['إصابة خطيرة', 'وفاة', 'حريق', 'انفجار', 'طوارئ'];
        const highKeywords = ['إصابة', 'مصاب', 'دماء'];
        
        const descLower = description.toLowerCase();
        if (criticalKeywords.some(keyword => descLower.includes(keyword.toLowerCase()))) {
            reportData.priority = 'critical';
        } else if (highKeywords.some(keyword => descLower.includes(keyword.toLowerCase()))) {
            reportData.priority = 'high';
        }

        // Create report
        const report = await AccidentReport.create(reportData);

        res.status(201).json({
            success: true,
            message: 'تم إرسال البلاغ بنجاح',
            report
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
export const getAllReports = async (req, res, next) => {
    try {
        const { status, priority, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const reports = await AccidentReport.find(query)
            .populate('reporter', 'fullName phone email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await AccidentReport.countDocuments(query);

        res.json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            reports
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's own reports
// @route   GET /api/reports/my-reports
// @access  Private
export const getMyReports = async (req, res, next) => {
    try {
        const reports = await AccidentReport.find({ reporter: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res, next) => {
    try {
        const report = await AccidentReport.findById(req.params.id)
            .populate('reporter', 'fullName phone email')
            .populate('assignedTo', 'fullName role');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        // Check if user is authorized to view this report
        if (report.reporter._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this report'
            });
        }

        res.json({
            success: true,
            report
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
export const updateReportStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;

        const report = await AccidentReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        report.status = status;

        if (status === 'resolved') {
            report.resolvedAt = new Date();
            // Calculate response time in minutes
            report.responseTime = Math.floor((report.resolvedAt - report.createdAt) / 60000);
        }

        if (note) {
            report.notes.push({
                user: req.user._id,
                text: note
            });
        }

        await report.save();

        res.json({
            success: true,
            message: 'Report status updated successfully',
            report
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
export const deleteReport = async (req, res, next) => {
    try {
        const report = await AccidentReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        await report.deleteOne();

        res.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get nearby reports
// @route   GET /api/reports/nearby
// @access  Private
export const getNearbyReports = async (req, res, next) => {
    try {
        const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Please provide longitude and latitude'
            });
        }

        const reports = await AccidentReport.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).limit(50);

        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        next(error);
    }
};
