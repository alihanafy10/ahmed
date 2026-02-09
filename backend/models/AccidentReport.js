import mongoose from 'mongoose';

const accidentReportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reporterInfo: {
        name: String,
        nationalId: String,
        phone: String,
        email: String
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: String,
        accuracy: Number
    },
    mediaFiles: [{
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    voiceRecording: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        duration: Number
    },
    faceCapture: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    notes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolvedAt: Date,
    responseTime: Number // in minutes
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
accidentReportSchema.index({ location: '2dsphere' });

// Index for faster queries
accidentReportSchema.index({ status: 1, createdAt: -1 });
accidentReportSchema.index({ reporter: 1, createdAt: -1 });

export default mongoose.model('AccidentReport', accidentReportSchema);
