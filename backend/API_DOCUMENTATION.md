# API Documentation

Complete API documentation for the Accident Reporting System Backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "fullName": "أحمد محمد علي",
  "nationalId": "12345678901234",
  "phone": "01012345678",
  "email": "ahmed@example.com",
  "password": "securePassword123",
  "birthDate": "1990-01-01",
  "address": "123 شارع الجامعة، المعادي",
  "governorate": "القاهرة"
}
```

**Validation Rules:**
- `fullName`: Required, string
- `nationalId`: Required, exactly 14 digits, unique
- `phone`: Required, Egyptian format (010|011|012|015 + 8 digits), unique
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters
- `birthDate`: Required, ISO 8601 date format
- `address`: Required, string
- `governorate`: Required, string

**Response (201 Created):**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "أحمد محمد علي",
    "nationalId": "12345678901234",
    "phone": "01012345678",
    "email": "ahmed@example.com",
    "birthDate": "1990-01-01T00:00:00.000Z",
    "address": "123 شارع الجامعة، المعادي",
    "governorate": "القاهرة",
    "role": "user",
    "isVerified": false,
    "createdAt": "2024-02-09T12:00:00.000Z",
    "updatedAt": "2024-02-09T12:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "البريد الإلكتروني مسجل بالفعل"
}
```

---

### 2. Login User

Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "identifier": "ahmed@example.com",  // Can be email or phone
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "أحمد محمد علي",
    "email": "ahmed@example.com",
    "phone": "01012345678",
    "role": "user"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "بيانات الدخول غير صحيحة"
}
```

---

### 3. Get Current User

Get the currently authenticated user's information.

**Endpoint:** `GET /auth/me`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "أحمد محمد علي",
    "nationalId": "12345678901234",
    "phone": "01012345678",
    "email": "ahmed@example.com",
    "address": "123 شارع الجامعة، المعادي",
    "governorate": "القاهرة",
    "role": "user",
    "createdAt": "2024-02-09T12:00:00.000Z"
  }
}
```

---

### 4. Update Profile

Update the current user's profile information.

**Endpoint:** `PUT /auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "fullName": "أحمد محمد علي السيد",
  "phone": "01098765432",
  "email": "ahmed.new@example.com",
  "address": "456 شارع النيل، المعادي",
  "governorate": "الجيزة"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "تم تحديث الملف الشخصي بنجاح",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "أحمد محمد علي السيد",
    "phone": "01098765432",
    "email": "ahmed.new@example.com",
    "address": "456 شارع النيل، المعادي",
    "governorate": "الجيزة"
  }
}
```

---

## Report Endpoints

### 5. Create Accident Report

Submit a new accident report with optional media files.

**Endpoint:** `POST /reports`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `description` (required): Text description of the accident
- `location` (required): JSON string with location data
- `media_0` to `media_4` (optional): Image or video files
- `voice` (optional): Audio recording file
- `face_capture` (optional): Face verification image

**Example Request:**
```javascript
const formData = new FormData();
formData.append('description', 'حادث سير على طريق القاهرة الإسكندرية الصحراوي');
formData.append('location', JSON.stringify({
  latitude: 30.0444,
  longitude: 31.2357,
  address: 'طريق القاهرة الإسكندرية الصحراوي، الكيلو 28',
  accuracy: 10
}));
formData.append('media_0', imageFile1);
formData.append('media_1', imageFile2);
formData.append('voice', audioFile);
formData.append('face_capture', faceImage);
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "تم إرسال البلاغ بنجاح",
  "report": {
    "_id": "507f191e810c19729de860ea",
    "reporter": "507f1f77bcf86cd799439011",
    "reporterInfo": {
      "name": "أحمد محمد علي",
      "nationalId": "12345678901234",
      "phone": "01012345678",
      "email": "ahmed@example.com"
    },
    "description": "حادث سير على طريق القاهرة الإسكندرية الصحراوي",
    "location": {
      "type": "Point",
      "coordinates": [31.2357, 30.0444],
      "address": "طريق القاهرة الإسكندرية الصحراوي، الكيلو 28",
      "accuracy": 10
    },
    "mediaFiles": [
      {
        "filename": "media_0-1707480000000-123456789.jpg",
        "path": "uploads/media/media_0-1707480000000-123456789.jpg",
        "mimetype": "image/jpeg",
        "size": 245678
      }
    ],
    "voiceRecording": {
      "filename": "voice-1707480000000-987654321.mp3",
      "path": "uploads/voice/voice-1707480000000-987654321.mp3",
      "mimetype": "audio/mp3",
      "size": 123456
    },
    "status": "pending",
    "priority": "medium",
    "createdAt": "2024-02-09T14:30:00.000Z",
    "updatedAt": "2024-02-09T14:30:00.000Z"
  }
}
```

---

### 6. Get My Reports

Get all reports submitted by the current user.

**Endpoint:** `GET /reports/my-reports`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "reports": [
    {
      "_id": "507f191e810c19729de860ea",
      "description": "حادث سير على طريق القاهرة الإسكندرية",
      "status": "pending",
      "priority": "high",
      "createdAt": "2024-02-09T14:30:00.000Z"
    }
  ]
}
```

---

### 7. Get Report by ID

Get detailed information about a specific report.

**Endpoint:** `GET /reports/:id`

**Authentication:** Required

**Parameters:**
- `id`: Report ID

**Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "_id": "507f191e810c19729de860ea",
    "reporter": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "أحمد محمد علي",
      "phone": "01012345678",
      "email": "ahmed@example.com"
    },
    "description": "حادث سير على طريق القاهرة الإسكندرية",
    "location": {
      "type": "Point",
      "coordinates": [31.2357, 30.0444],
      "address": "طريق القاهرة الإسكندرية الصحراوي"
    },
    "mediaFiles": [...],
    "status": "pending",
    "priority": "high",
    "createdAt": "2024-02-09T14:30:00.000Z"
  }
}
```

---

### 8. Get Nearby Reports

Find reports near a specific location.

**Endpoint:** `GET /reports/nearby`

**Authentication:** Required

**Query Parameters:**
- `longitude` (required): Longitude coordinate
- `latitude` (required): Latitude coordinate
- `maxDistance` (optional): Maximum distance in meters (default: 5000)

**Example:**
```
GET /reports/nearby?longitude=31.2357&latitude=30.0444&maxDistance=3000
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "reports": [
    {
      "_id": "507f191e810c19729de860ea",
      "description": "حادث على بعد 500 متر",
      "location": {
        "type": "Point",
        "coordinates": [31.2360, 30.0450]
      },
      "status": "pending",
      "createdAt": "2024-02-09T14:30:00.000Z"
    }
  ]
}
```

---

### 9. Get All Reports (Admin Only)

Get all reports with pagination and filtering.

**Endpoint:** `GET /reports`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `status` (optional): Filter by status (pending|in_progress|resolved|rejected)
- `priority` (optional): Filter by priority (low|medium|high|critical)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example:**
```
GET /reports?status=pending&priority=high&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 45,
  "totalPages": 5,
  "currentPage": 1,
  "reports": [...]
}
```

---

### 10. Update Report Status (Admin Only)

Update the status of a report and add notes.

**Endpoint:** `PUT /reports/:id/status`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "status": "in_progress",
  "note": "تم توجيه فريق الاستجابة السريعة"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report status updated successfully",
  "report": {
    "_id": "507f191e810c19729de860ea",
    "status": "in_progress",
    "notes": [
      {
        "user": "507f1f77bcf86cd799439012",
        "text": "تم توجيه فريق الاستجابة السريعة",
        "createdAt": "2024-02-09T15:00:00.000Z"
      }
    ]
  }
}
```

---

### 11. Delete Report (Admin Only)

Delete a report from the system.

**Endpoint:** `DELETE /reports/:id`

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## User Management Endpoints (Admin Only)

### 12. Get All Users

Get a list of all users with pagination and search.

**Endpoint:** `GET /users`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name, email, or phone

**Response (200 OK):**
```json
{
  "success": true,
  "count": 150,
  "totalPages": 8,
  "currentPage": 1,
  "users": [...]
}
```

---

### 13. Get User by ID

**Endpoint:** `GET /users/:id`

**Authentication:** Required (Admin only)

---

### 14. Update User

**Endpoint:** `PUT /users/:id`

**Authentication:** Required (Admin only)

---

### 15. Delete User

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required (Admin only)

---

## Error Responses

### Common Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## File Upload Specifications

### Accepted File Types

**Images:**
- JPEG, JPG, PNG, GIF, WebP

**Videos:**
- MP4, AVI, MOV, WMV, WebM

**Audio:**
- MP3, WAV, OGG, M4A, WebM

### Size Limits

- Maximum file size: 10MB per file
- Maximum total upload: 50MB per request

### File Storage

Files are stored in the following directories:
- `/uploads/media/` - Accident scene media
- `/uploads/voice/` - Voice recordings
- `/uploads/faces/` - Face verification images

---

## Rate Limiting

To prevent abuse, the API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Authentication endpoints: 5 requests per 15 minutes

---

## CORS Policy

The API allows requests from:
- `http://localhost:5173` (Development frontend)
- Configurable via `CORS_ORIGIN` environment variable

---

## Status and Priority Values

### Report Status
- `pending` - Awaiting review
- `in_progress` - Being handled
- `resolved` - Completed
- `rejected` - Dismissed

### Report Priority
- `low` - Minor incidents
- `medium` - Standard accidents (default)
- `high` - Serious incidents
- `critical` - Life-threatening situations

Priority is automatically determined based on keywords in the description.

---

## Geospatial Queries

The API uses MongoDB's geospatial features for location-based queries. Coordinates follow the GeoJSON format:

```
[longitude, latitude]
```

**Note:** Longitude comes first, followed by latitude (opposite of typical lat/lng order).
