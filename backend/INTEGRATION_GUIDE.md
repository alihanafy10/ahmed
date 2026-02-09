# Frontend Integration Guide

This guide explains how to integrate the frontend React application with the backend API.

## Setup

### 1. Install Axios in Frontend

```bash
cd frontend
npm install axios
```

### 2. Create API Configuration

Create a file `frontend/src/config/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Update Frontend Files

### Update `frontend/src/utils/mockDb.js`

Replace the mock functions with real API calls:

```javascript
import api from '../config/api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Store token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'حدث خطأ أثناء التسجيل' 
    };
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post('/auth/login', { identifier, password });
    
    // Store token and user
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    
    return { 
      success: true, 
      user: response.data.user 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'بيانات الدخول غير صحيحة' 
    };
  }
};

export const getUsers = () => {
  const user = localStorage.getItem('currentUser');
  return user ? [JSON.parse(user)] : [];
};
```

### Update `frontend/src/pages/AccidentReport.jsx`

Modify the `handleSubmit` function:

```javascript
import api from '../config/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    
    // Append location data
    if (location) {
      formData.append('location', JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || '',
        accuracy: location.accuracy || 0
      }));
    }
    
    // Append description
    formData.append('description', description);
    
    // Append media files
    mediaFiles.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });

    // Append voice recording
    if (voice) {
      formData.append('voice', voice);
    }

    // Append face capture
    if (capturedFace) {
      formData.append('face_capture', capturedFace);
    }

    // Send to backend
    const response = await api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Report submitted successfully:', response.data);
    setIsSubmitting(false);
    setSubmitted(true);
  } catch (error) {
    console.error('Error submitting report:', error);
    setIsSubmitting(false);
    alert(error.response?.data?.message || 'حدث خطأ أثناء إرسال البلاغ');
  }
};
```

## Testing the Integration

### 1. Start MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 2. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Server should start on `http://localhost:5000`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend should start on `http://localhost:5173`

### 4. Test the Flow

1. Register a new user
2. Login with credentials
3. Complete face capture
4. Submit an accident report
5. Check backend console for logs
6. Check MongoDB for stored data

## Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Update API config to use this:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Common Issues

### CORS Errors

Make sure backend `.env` has:
```
CORS_ORIGIN=http://localhost:5173
```

### File Upload Issues

- Ensure files are being appended to FormData correctly
- Check file size limits (max 10MB)
- Verify file types are allowed

### Authentication Issues

- Token expires after 7 days by default
- Clear localStorage if having issues
- Check browser console for token errors

## Production Deployment

### Backend

1. Set environment variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=very-secure-random-string
CORS_ORIGIN=https://your-frontend-domain.com
```

2. Deploy to services like:
- Heroku
- DigitalOcean
- AWS EC2
- Railway

### Frontend

Update API URL to production backend:
```env
VITE_API_URL=https://your-backend-api.com/api
```

Deploy to:
- Vercel
- Netlify
- GitHub Pages
