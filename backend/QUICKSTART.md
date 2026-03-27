# Quick Start Guide

Get the backend up and running in 5 minutes.

## Prerequisites

- ✅ Node.js 16+ installed
- ✅ MongoDB installed and running
- ✅ npm or yarn

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

The `.env` file is already created with default values. You can modify it if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/accident_report_db
JWT_SECRET=accident_report_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
```

## Step 3: Start MongoDB

### Windows
```bash
net start MongoDB
```

### macOS
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
```

### Docker (Alternative)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000 in development mode
```

## Step 5: Test the API

### Option 1: Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "nationalId": "12345678901234",
    "phone": "01012345678",
    "email": "test@example.com",
    "password": "password123",
    "birthDate": "1990-01-01",
    "address": "123 Test Street",
    "governorate": "القاهرة"
  }'
```

### Option 2: Using Postman

1. Import the API endpoints from `API_DOCUMENTATION.md`
2. Start making requests

### Option 3: Connect Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and test the full application.

## Verify Installation

✅ Server starts without errors  
✅ MongoDB connection successful  
✅ Can register a new user  
✅ Can login with credentials  
✅ Receive JWT token  

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB Connection Error`

**Solution:**
1. Check if MongoDB is running: `mongod --version`
2. Verify connection string in `.env`
3. Start MongoDB service

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
1. Change `PORT` in `.env` to another port (e.g., 5001)
2. Or kill the process using port 5000

### Module Not Found

**Error:** `Cannot find module...`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 📋 Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API endpoints
- 🔗 Follow [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) to connect frontend

## Support

For issues, check the documentation or create an issue in the repository.

Happy coding! 🚀
