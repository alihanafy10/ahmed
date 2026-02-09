# 🚨 Accident Reporting System

A full-stack web application for reporting and managing accident incidents with advanced features including face recognition, voice recording, location tracking, and media uploads.

## 📋 Features

### 🎯 Core Features
- **User Authentication**: Secure registration and login with JWT
- **Accident Reporting**: Create, view, and manage accident reports
- **Face Recognition**: Capture and verify faces using face-api.js
- **Voice Recording**: Record audio descriptions of incidents
- **Location Tracking**: GPS coordinates capture
- **Photo Upload**: Camera capture and image upload
- **Media Management**: Store and retrieve accident-related media

### 🔐 Security
- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for HTTP headers security
- Rate limiting
- CORS protection
- Input validation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **face-api.js** - Face recognition
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Express Validator** - Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB Atlas account (already configured)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/alihanafy10/ahmed.git
   cd ahmed
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file (or use existing one)
   cp .env.example .env
   
   # Start backend server
   npm start
   # Server runs on http://localhost:5000
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Start frontend dev server
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

## 🌐 Deploy to Vercel

### Quick Deploy (2 Projects)

You need to deploy **TWO separate projects** on Vercel:

#### 1️⃣ Deploy Backend API

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alihanafy10/ahmed)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `alihanafy10/ahmed`
3. **Root Directory**: `backend`
4. **Framework**: Other
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://alikato:ytIbBw68Uxr1jeBG@kato.ixssyb0.mongodb.net/ahmed?retryWrites=true&w=majority
   JWT_SECRET=accident_report_super_secret_jwt_key_2024_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=production
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   CORS_ORIGIN=*
   ```
6. Click **Deploy**
7. **Save your backend URL**: e.g., `https://ahmed-backend.vercel.app`

#### 2️⃣ Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import: `alihanafy10/ahmed` (same repo)
3. **Root Directory**: `frontend`
4. **Framework**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```
   (Replace with your actual backend URL from step 1)
8. Click **Deploy**

#### 3️⃣ Update Backend CORS

1. Go to backend project → Settings → Environment Variables
2. Update `CORS_ORIGIN` to your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
3. Redeploy backend

### Detailed Guide

For step-by-step instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📁 Project Structure

```
ahmed/
├── backend/                 # Express.js API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   └── vercel.json         # Vercel config
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── config/        # API configuration
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── vercel.json        # Vercel config
│
└── README.md              # This file
```

## 📖 API Documentation

See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for detailed API documentation.

### Quick API Reference

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

**Reports**
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

**Users** (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Building for Production

```bash
# Frontend
cd frontend
npm run build
# Output in dist/

# Backend
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Ali Hanafy**
- GitHub: [@alihanafy10](https://github.com/alihanafy10)
- Repository: [ahmed](https://github.com/alihanafy10/ahmed)

## 🙏 Acknowledgments

- Face detection powered by [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- UI styled with [TailwindCSS](https://tailwindcss.com/)

## 📞 Support

If you encounter any issues or have questions:
- Open an issue: [GitHub Issues](https://github.com/alihanafy10/ahmed/issues)
- Check documentation: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Made with ❤️ for safer roads**
