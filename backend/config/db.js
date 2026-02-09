import mongoose from 'mongoose';

let isConnected = false; // Track connection status

const connectDB = async () => {
    // If already connected, return
    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        // Set mongoose options for serverless
        mongoose.set('strictQuery', false);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false, // Disable buffering for serverless
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        isConnected = conn.connections[0].readyState === 1;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        throw error; // Don't exit process in serverless
    }
};

export default connectDB;
