# 🚨 Accident Report System

A comprehensive web application for reporting and managing traffic accidents with multimedia support, geolocation, and real-time reporting capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### User Features
- 🔐 **User Authentication** - Secure registration and login with JWT
- 👤 **Face Recognition** - Capture and store reporter's face for verification
- 📍 **Geolocation** - Automatic GPS location capture with address
- 📸 **Media Upload** - Upload multiple photos and videos of the accident
- 🎤 **Voice Recording** - Record voice description of the incident
- 📝 **Detailed Reports** - Comprehensive accident report forms
- 📱 **PWA Support** - Install as a mobile app (Progressive Web App)
- 🌐 **Responsive Design** - Works on desktop, tablet, and mobile

### Admin Features
- 📊 **Report Management** - View and manage all accident reports
- 👥 **User Management** - Manage registered users
- 🔍 **Search & Filter** - Advanced filtering and search capabilities
- 📈 **Analytics** - View accident statistics and trends

### Technical Features
- 🔒 **Secure File Storage** - Local file storage with URL-based access
- 🗄️ **MongoDB Database** - Scalable NoSQL database
- 🚀 **Optimized Performance** - Smart caching with service workers
- 📡 **RESTful API** - Well-structured backend API
- 🎨 **Modern UI** - Built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **PWA** - Progressive Web App capabilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/accident-report-system.git
cd accident-report-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/accident-report-db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Configuration

1. Create `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

2. Update the `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

#### Start MongoDB

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongodb
```

#### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Preview Production Build

```bash
npm run preview
```

Preview will run on: http://localhost:4173

#### Start Backend in Production

```bash
cd backend
npm start
```

## 📁 Project Structure

```
accident-report-system/
├── backend/
│   ├── api/                    # API entry point for serverless
│   ├── config/                 # Configuration files
│   │   └── db.js              # Database connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   └── userController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Error handling
│   │   └── upload.js         # File upload middleware
│   ├── models/               # Database models
│   │   ├── User.js
│   │   └── AccidentReport.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── reports.js
│   │   └── users.js
│   ├── uploads/              # Uploaded files (gitignored)
│   │   ├── faces/
│   │   ├── media/
│   │   └── voice/
│   ├── utils/                # Utility functions
│   │   ├── constants.js
│   │   └── fileHelper.js
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── server.js             # Express server
│
├── frontend/
│   ├── public/               # Static files
│   │   └── Image/           # App images and icons
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── CameraCapture.jsx
│   │   │   ├── FaceCapture.jsx
│   │   │   ├── LocationCapture.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   └── pwa/         # PWA components
│   │   ├── config/          # Configuration
│   │   │   └── api.js       # Axios configuration
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AccidentReport.jsx
│   │   │   └── FaceCapturePage.jsx
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind CSS configuration
│
├── .gitignore
├── README.md
└── PRODUCTION_BUILD_FIX.md  # Production issues documentation
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "nationalId": "1234567890",
  "phone": "0501234567",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Report Endpoints

#### Create Report
```http
POST /api/reports
Authorization: Bearer {token}
Content-Type: multipart/form-data

description: "Accident description"
location: {"latitude": 24.7136, "longitude": 46.6753, "address": "Riyadh", "accuracy": 10}
media_0: [File]
media_1: [File]
voice: [File]
face_capture: [File]
```

#### Get All Reports
```http
GET /api/reports
Authorization: Bearer {token}
```

#### Get Report by ID
```http
GET /api/reports/:id
Authorization: Bearer {token}
```

For complete API documentation, see [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## 🌐 Deployment

### Deploying to Vercel

#### Backend Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy backend:
```bash
cd backend
vercel --prod
```

3. Set environment variables in Vercel dashboard

#### Frontend Deployment

1. Update `frontend/.env` with production backend URL:
```env
VITE_API_URL=https://your-backend.vercel.app
```

2. Deploy frontend:
```bash
cd frontend
vercel --prod
```

For detailed deployment guides, see:
- [backend/VERCEL_SETUP.md](backend/VERCEL_SETUP.md)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🔧 Troubleshooting

### Common Issues

#### Files not uploading in production
- See [PRODUCTION_BUILD_FIX.md](PRODUCTION_BUILD_FIX.md)
- Ensure service worker is configured correctly
- Clear browser cache and service worker

#### MongoDB connection failed
- Ensure MongoDB is running
- Check MongoDB URI in `.env`
- Verify network connectivity

#### CORS errors
- Check backend CORS configuration
- Ensure frontend API URL is correct
- Verify both servers are running

## 🧪 Testing

### Test with Postman

1. Import the collection:
   - File: `backend/Accident_Report_API.postman_collection.json`

2. Follow the guide:
   - See: `backend/POSTMAN_TEST_GUIDE.md`

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `NODE_ENV` - Environment (development/production)
- `BASE_URL` - Backend base URL

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspiration from modern accident reporting systems
- Built with love for public safety

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ for safer roads
