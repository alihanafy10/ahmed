import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';

// Import error handler
import errorHandler from './middleware/errorHandler.js';

// ES Module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

const app = express();

// Import database connection
import connectDB from './config/db.js';

// Connect to database (for serverless, this will reconnect as needed)
connectDB().catch(err => console.error('Initial DB connection failed:', err));

// Middleware to ensure DB connection on each request (important for serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في الاتصال بقاعدة البيانات' 
        });
    }
});

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
// Allow multiple origins (dev and preview)
const allowedOrigins = [
    'http://localhost:5173', // npm run dev
    'http://localhost:4174', // npm run preview
    'http://localhost:5174', // alternative preview port
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        console.log('CORS request from origin:', origin);
        
        // Allow any localhost origin
        if (origin && origin.startsWith('http://localhost')) {
            console.log('✅ Localhost origin allowed:', origin);
            callback(null, true);
        } else if (allowedOrigins.indexOf(origin) !== -1) {
            console.log('✅ Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('❌ Origin blocked:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Only parse JSON and urlencoded for non-multipart requests
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
        express.json()(req, res, () => {
            express.urlencoded({ extended: true })(req, res, next);
        });
    } else {
        next();
    }
});

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Accident Report API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
