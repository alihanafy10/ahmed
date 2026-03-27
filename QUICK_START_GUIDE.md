# 🚀 Quick Start Guide - Accident Reporting System

## ✅ Configuration Complete!

All environment variables have been properly configured and tested. The project is ready to run!

---

## 📋 Current Configuration

### Backend Configuration (backend/.env)
- **Server Port**: 5000
- **Environment**: development
- **Database**: MongoDB Atlas (Cloud) - `accident_report_db`
- **Database Status**: ✅ **CONNECTED AND WORKING**
- **CORS Origin**: http://localhost:5173
- **JWT Secret**: Configured ✓
- **File Upload**: Enabled (Max 10MB)

### Frontend Configuration (frontend/.env)
- **API URL**: http://localhost:5000
- **Environment**: Local Development

---

## 🎯 How to Run the Project

### Step 1: Install Dependencies

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start the Servers

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
# or
npm start
```

You should see:
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected: ac-q43l4wt-shard-00-01.ixssyb0.mongodb.net
```

**Terminal 2 - Start Frontend Server:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔧 What Was Fixed

1. ✅ **Database Configuration**: Updated `backend/config/db.js` to read from environment variables
2. ✅ **MongoDB URI**: Changed database name from `ahmed` to `accident_report_db`
3. ✅ **Environment Files**: Added clear comments and proper formatting
4. ✅ **Connection Test**: Verified MongoDB Atlas connection is working
5. ✅ **CORS Settings**: Properly configured for local development

---

## 📊 Database Information

- **Type**: MongoDB Atlas (Cloud Database)
- **Database Name**: accident_report_db
- **Connection**: Active and verified ✓
- **Collections**: Users, AccidentReports (auto-created on first use)

---

## 🎨 Features Available

Once running, you can:
- ✅ Register new users
- ✅ Login with authentication
- ✅ Create accident reports
- ✅ Upload photos/videos
- ✅ Record voice notes
- ✅ Capture face recognition data
- ✅ Get GPS location

---

## 🔐 Test API Endpoints

You can test the API using the included test file:
```bash
cd backend
node test-api.js
```

Or test manually:
```bash
# Health check
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","fullName":"Test User","phoneNumber":"1234567890"}'
```

---

## 🌐 Production Deployment

When ready to deploy:

1. **Backend**: Update `CORS_ORIGIN` in `backend/.env` to your frontend URL
2. **Frontend**: Update `VITE_API_URL` in `frontend/.env` to your backend URL
3. **Security**: Generate a new strong `JWT_SECRET`

---

## 🆘 Troubleshooting

### Backend won't start?
- Check if port 5000 is already in use
- Verify MongoDB connection string in `.env`
- Run `npm install` again

### Frontend won't connect to backend?
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`
- Clear browser cache

### Database connection error?
- Verify internet connection (MongoDB Atlas is cloud-based)
- Check if MongoDB Atlas IP whitelist includes your IP
- The current configuration uses MongoDB Atlas with existing credentials

---

## 📝 Notes

- The database is already configured and tested
- No local MongoDB installation required (using cloud)
- All sensitive data is in `.env` files (not committed to git)
- Upload folders are automatically created on first use

---

**Ready to go! 🎉**

Just run `npm run dev` in both backend and frontend folders, and start using the application!
