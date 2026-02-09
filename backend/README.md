# Accident Report Backend API

A comprehensive Node.js/Express backend API for the Accident Reporting System with user authentication, accident report management, and file upload capabilities.

## Features

- ✅ User Registration & Authentication (JWT)
- ✅ User Profile Management
- ✅ Accident Report Submission with Location
- ✅ File Upload (Images, Videos, Voice Recordings)
- ✅ Face Capture Verification
- ✅ Geospatial Queries (Nearby Reports)
- ✅ Admin Panel Support
- ✅ Report Status Management
- ✅ Arabic Language Support

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` file:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/accident_report_db
     JWT_SECRET=your_secret_key_here
     JWT_EXPIRE=7d
     CORS_ORIGIN=http://localhost:5173
     MAX_FILE_SIZE=10485760
     ```

4. **Make sure MongoDB is running**:
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   
   # Or run MongoDB locally
   mongod
   ```

5. **Start the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Report Routes (`/api/reports`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reports` | Create accident report | Yes |
| GET | `/api/reports` | Get all reports (Admin) | Yes (Admin) |
| GET | `/api/reports/my-reports` | Get user's reports | Yes |
| GET | `/api/reports/nearby` | Get nearby reports | Yes |
| GET | `/api/reports/:id` | Get report by ID | Yes |
| PUT | `/api/reports/:id/status` | Update report status | Yes (Admin) |
| DELETE | `/api/reports/:id` | Delete report | Yes (Admin) |

### User Routes (`/api/users`) - Admin Only

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | Yes (Admin) |
| GET | `/api/users/:id` | Get user by ID | Yes (Admin) |
| PUT | `/api/users/:id` | Update user | Yes (Admin) |
| DELETE | `/api/users/:id` | Delete user | Yes (Admin) |

## Request Examples

### 1. Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "أحمد محمد",
  "nationalId": "12345678901234",
  "phone": "01012345678",
  "email": "ahmed@example.com",
  "password": "password123",
  "birthDate": "1990-01-01",
  "address": "123 شارع الجامعة",
  "governorate": "القاهرة"
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "ahmed@example.com",  // or phone number
  "password": "password123"
}
```

### 3. Create Accident Report

```bash
POST /api/reports
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "description": "حادث سير على طريق القاهرة الإسكندرية",
  "location": {
    "latitude": 30.0444,
    "longitude": 31.2357,
    "address": "طريق القاهرة الإسكندرية الصحراوي",
    "accuracy": 10
  },
  "media_0": [file],
  "media_1": [file],
  "voice": [audio file],
  "face_capture": [image file]
}
```

### 4. Get Nearby Reports

```bash
GET /api/reports/nearby?longitude=31.2357&latitude=30.0444&maxDistance=5000
Authorization: Bearer {token}
```

## File Upload

The API accepts the following file types:

- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Videos**: MP4, AVI, MOV, WMV, WebM
- **Audio**: MP3, WAV, OGG, M4A, WebM

**Max file size**: 10MB (configurable in `.env`)

Files are stored in:
- `/uploads/media/` - Accident scene photos/videos
- `/uploads/voice/` - Voice recordings
- `/uploads/faces/` - Face verification images

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login/register, include the token in the Authorization header:

```
Authorization: Bearer {your_token_here}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Database Schema

### User Model
- fullName
- nationalId (unique, 14 digits)
- phone (unique, Egyptian format)
- email (unique)
- password (hashed)
- birthDate
- address
- governorate
- faceData
- role (user/admin)

### AccidentReport Model
- reporter (ref: User)
- reporterInfo (embedded)
- description
- location (GeoJSON Point)
- mediaFiles (array)
- voiceRecording
- faceCapture
- status (pending/in_progress/resolved/rejected)
- priority (low/medium/high/critical)
- assignedTo (ref: User)
- notes (array)

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers
- File type validation
- File size limits

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

## Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── reportController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
├── models/             # Mongoose models
│   ├── User.js
│   └── AccidentReport.js
├── routes/             # Route definitions
│   ├── auth.js
│   ├── reports.js
│   └── users.js
├── uploads/            # Uploaded files
│   ├── media/
│   ├── voice/
│   └── faces/
├── .env               # Environment variables
├── .env.example       # Example environment file
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
├── server.js         # Entry point
└── README.md         # Documentation
```

## Frontend Integration

Update your frontend API calls to use this backend:

```javascript
// Example: Login
const response = await axios.post('http://localhost:5000/api/auth/login', {
  identifier: 'ahmed@example.com',
  password: 'password123'
});

const token = response.data.token;
localStorage.setItem('token', token);

// Example: Create Report
const formData = new FormData();
formData.append('description', 'Accident description');
formData.append('location', JSON.stringify({
  latitude: 30.0444,
  longitude: 31.2357
}));

const response = await axios.post('http://localhost:5000/api/reports', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
