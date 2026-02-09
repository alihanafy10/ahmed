import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import authRoutes from '../routes/auth.js';
import reportRoutes from '../routes/reports.js';
import userRoutes from '../routes/users.js';

// Import error handler
import errorHandler from '../middleware/errorHandler.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

const app = express();

// Test endpoint that doesn't require DB (for debugging)
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Vercel serverless function is working!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Middleware to ensure DB connection on each request (important for serverless)
app.use(async (req, res, next) => {
    // Skip DB connection for test endpoint
    if (req.path === '/api/test' || req.path === '/api/health') {
        return next();
    }
    
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في الاتصال بقاعدة البيانات',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

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

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Accident Report API',
        version: '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            reports: '/api/reports',
            users: '/api/users'
        }
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Accident Report API',
        version: '1.0.0',
        status: 'online',
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

// Export for Vercel serverless
export default app;

// For local testing
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}
