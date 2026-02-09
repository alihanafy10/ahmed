# Backend Project Summary

## ✅ Project Complete!

A complete Node.js/Express backend has been created in the `backend` folder for your Accident Reporting System.

## 📁 Project Structure

```
backend/
├── 📄 Configuration Files
│   ├── .env                    # Environment variables (configured)
│   ├── .env.example           # Example environment file
│   ├── package.json           # Dependencies and scripts
│   └── .gitignore            # Git ignore rules
│
├── 📖 Documentation
│   ├── README.md              # Main documentation
│   ├── QUICKSTART.md          # Quick start guide (5 minutes)
│   ├── API_DOCUMENTATION.md   # Complete API reference
│   └── INTEGRATION_GUIDE.md   # Frontend integration guide
│
├── 🔧 Core Files
│   ├── server.js              # Main application entry point
│   └── test-api.js            # API testing script
│
├── 📂 config/
│   └── db.js                  # Database connection configuration
│
├── 📂 models/
│   ├── User.js                # User schema (MongoDB)
│   └── AccidentReport.js      # Accident report schema
│
├── 📂 controllers/
│   ├── authController.js      # Authentication logic
│   ├── reportController.js    # Report management logic
│   └── userController.js      # User management logic
│
├── 📂 routes/
│   ├── auth.js                # Authentication routes
│   ├── reports.js             # Report routes
│   └── users.js               # User management routes
│
├── 📂 middleware/
│   ├── auth.js                # JWT authentication middleware
│   ├── errorHandler.js        # Global error handler
│   └── upload.js              # File upload middleware (Multer)
│
└── 📂 utils/
    └── constants.js           # App constants and configurations
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 3. Start the Server
```bash
npm run dev
```

Server will run on: **http://localhost:5000**

### 4. Test the API (Optional)
```bash
node test-api.js
```

## 🎯 Key Features

### ✅ Authentication System
- User registration with validation
- Login with email or phone
- JWT token-based authentication
- Password hashing with bcrypt
- Profile management

### ✅ Accident Reporting
- Create reports with location (GeoJSON)
- Upload multiple media files (images/videos)
- Voice recording support
- Face capture verification
- Automatic priority detection
- Geospatial queries (nearby reports)

### ✅ Admin Features
- View all reports
- Update report status
- User management
- Add notes to reports
- Track response times

### ✅ File Upload
- Support for images, videos, and audio
- 10MB file size limit
- Organized file storage
- Type validation

### ✅ Security
- JWT authentication
- Password hashing
- Input validation
- CORS protection
- Helmet security headers
- Rate limiting ready

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `PUT /profile` - Update profile

### Reports (`/api/reports`)
- `POST /` - Create accident report
- `GET /my-reports` - Get user's reports
- `GET /nearby` - Get nearby reports
- `GET /:id` - Get report by ID
- `GET /` - Get all reports (Admin)
- `PUT /:id/status` - Update status (Admin)
- `DELETE /:id` - Delete report (Admin)

### Users (`/api/users`) - Admin Only
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

## 🔗 Frontend Integration

### Update Frontend API Calls

1. **Install axios in frontend:**
```bash
cd frontend
npm install axios
```

2. **Create `frontend/src/config/api.js`:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

3. **Update `frontend/src/utils/mockDb.js`:**
```javascript
import api from '../config/api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message };
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return { success: true, user: response.data.user };
  } catch (error) {
    return { success: false, message: error.response?.data?.message };
  }
};
```

4. **Update `frontend/src/pages/AccidentReport.jsx` submit handler:**
```javascript
import api from '../config/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('location', JSON.stringify(location));
    
    mediaFiles.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });
    
    if (voice) formData.append('voice', voice);
    if (capturedFace) formData.append('face_capture', capturedFace);

    await api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setIsSubmitting(false);
    setSubmitted(true);
  } catch (error) {
    setIsSubmitting(false);
    alert(error.response?.data?.message || 'حدث خطأ');
  }
};
```

## 📚 Documentation

- **README.md** - Complete documentation with examples
- **QUICKSTART.md** - Get started in 5 minutes
- **API_DOCUMENTATION.md** - Full API reference with request/response examples
- **INTEGRATION_GUIDE.md** - Step-by-step frontend integration

## 🗄️ Database Models

### User Model
- fullName, nationalId, phone, email, password
- birthDate, address, governorate
- faceData, role, isVerified
- Timestamps (createdAt, updatedAt)

### AccidentReport Model
- reporter, reporterInfo, description
- location (GeoJSON Point with coordinates)
- mediaFiles, voiceRecording, faceCapture
- status, priority, assignedTo
- notes, resolvedAt, responseTime
- Timestamps

## 🛠️ Technologies Used

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer
- **Validation:** express-validator
- **Security:** Helmet, CORS
- **Logging:** Morgan

## 🔐 Environment Variables

The `.env` file is already configured with:
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/accident_report_db
- JWT_SECRET (change in production!)
- CORS_ORIGIN=http://localhost:5173
- MAX_FILE_SIZE=10485760

## 📝 Testing

### Manual Testing
```bash
node test-api.js
```

### Using cURL
```bash
curl http://localhost:5000/api/health
```

### Using Postman
Import endpoints from API_DOCUMENTATION.md

## 🚨 Important Notes

1. **MongoDB** must be running before starting the server
2. **Change JWT_SECRET** in production
3. **File uploads** are stored in `backend/uploads/` (auto-created)
4. **CORS** is configured for `http://localhost:5173`
5. **Default port** is 5000 (change in .env if needed)

## 📦 Dependencies

All dependencies are already configured in `package.json`:
- express
- mongoose
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- multer
- express-validator
- helmet
- morgan
- nodemon (dev)

## 🎉 Next Steps

1. ✅ Backend is complete and ready to use
2. 📱 Integrate with your frontend
3. 🧪 Test all endpoints
4. 🚀 Deploy to production when ready

## 📞 Support

For detailed information, check:
- `backend/README.md` - Main documentation
- `backend/API_DOCUMENTATION.md` - API reference
- `backend/INTEGRATION_GUIDE.md` - Frontend integration

---

**Your backend is now ready to use! 🎉**

Start the server with `npm run dev` and begin testing!
