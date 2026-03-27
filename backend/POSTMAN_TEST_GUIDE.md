# Postman Testing Guide for Accident Report API

## Prerequisites

1. **Register/Login** first to get an authentication token
2. Use the token in the Authorization header

---

## Step 1: Register a Test User

### Request
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/register`
- **Headers**: 
  - `Content-Type: application/json`

### Body (raw JSON)
```json
{
  "fullName": "Test User",
  "nationalId": "1234567890",
  "phone": "0501234567",
  "email": "test@example.com",
  "password": "Test123456"
}
```

### Response (Save the token!)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## Step 2: Create Accident Report with Files

### Request
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/reports`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - **DO NOT** set Content-Type (Postman sets it automatically for multipart)

### Body Type
Select **form-data** (not raw JSON!)

### Form Data Fields

| KEY | TYPE | VALUE |
|-----|------|-------|
| `description` | Text | `حادث مروري خطير على طريق الملك فهد` |
| `location` | Text | `{"latitude": 24.7136, "longitude": 46.6753, "address": "طريق الملك فهد، الرياض", "accuracy": 10}` |
| `media_0` | File | [Select an image file from your computer] |
| `media_1` | File | [Select another image file] |
| `voice` | File | [Select an audio file - .webm, .mp3, .wav] |
| `face_capture` | File | [Select a face image] |

---

## Step 3: Form Data Details

### Description Field
```
حادث مروري خطير على طريق الملك فهد مع وجود إصابات
```

### Location Field (must be valid JSON string)
```json
{"latitude": 24.7136, "longitude": 46.6753, "address": "طريق الملك فهد، الرياض", "accuracy": 10}
```

**Other location examples:**
```json
{"latitude": 21.3891, "longitude": 39.8579, "address": "جدة، المملكة العربية السعودية", "accuracy": 15}
```

```json
{"latitude": 26.4367, "longitude": 50.1039, "address": "الدمام، المملكة العربية السعودية", "accuracy": 8}
```

---

## Expected Response

```json
{
  "success": true,
  "message": "تم إرسال البلاغ بنجاح",
  "report": {
    "_id": "507f1f77bcf86cd799439011",
    "reporter": "507f191e810c19729de860ea",
    "reporterInfo": {
      "name": "Test User",
      "nationalId": "1234567890",
      "phone": "0501234567",
      "email": "test@example.com"
    },
    "description": "حادث مروري خطير على طريق الملك فهد",
    "location": {
      "type": "Point",
      "coordinates": [46.6753, 24.7136],
      "address": "طريق الملك فهد، الرياض",
      "accuracy": 10
    },
    "mediaFiles": [
      {
        "filename": "media_0-1711547234567-123456789.jpg",
        "url": "/uploads/media/media_0-1711547234567-123456789.jpg",
        "mimetype": "image/jpeg",
        "size": 524288,
        "uploadedAt": "2024-03-27T19:30:00.000Z"
      },
      {
        "filename": "media_1-1711547234568-987654321.jpg",
        "url": "/uploads/media/media_1-1711547234568-987654321.jpg",
        "mimetype": "image/jpeg",
        "size": 612345,
        "uploadedAt": "2024-03-27T19:30:00.000Z"
      }
    ],
    "voiceRecording": {
      "filename": "voice-1711547234569-456789123.webm",
      "url": "/uploads/voice/voice-1711547234569-456789123.webm",
      "mimetype": "audio/webm",
      "size": 102400
    },
    "faceCapture": {
      "filename": "face_capture-1711547234570-789123456.jpg",
      "url": "/uploads/faces/face_capture-1711547234570-789123456.jpg",
      "mimetype": "image/jpeg",
      "size": 245678
    },
    "status": "pending",
    "priority": "high",
    "createdAt": "2024-03-27T19:30:00.000Z",
    "updatedAt": "2024-03-27T19:30:00.000Z"
  }
}
```

---

## Important Notes

### 1. Files are OPTIONAL
You can test with just description and location:
- Minimum: `description` + `location`
- Optional: `media_0`, `media_1`, `voice`, `face_capture`

### 2. Media Files Naming
- First image/video: `media_0`
- Second image/video: `media_1`
- Third image/video: `media_2`
- And so on...

### 3. File Types Accepted
- **Media**: `image/jpeg`, `image/png`, `image/gif`, `video/mp4`, `video/webm`
- **Voice**: `audio/webm`, `audio/mpeg`, `audio/wav`
- **Face**: `image/jpeg`, `image/png`

### 4. Location Coordinates
- **Longitude** comes FIRST in coordinates array (GeoJSON format)
- Format: `[longitude, latitude]`

---

## Troubleshooting

### Error: "jwt must be provided"
→ Add Authorization header: `Bearer YOUR_TOKEN`

### Error: "Description is required"
→ Add description field in form-data

### Error: "Invalid location data"
→ Make sure location is valid JSON string

### Files not uploading
→ Make sure you selected "File" type in Postman form-data

### Empty mediaFiles array
→ Make sure field names are exactly: `media_0`, `media_1`, etc.

---

## Quick Test (No Files)

Minimal test with just text data:

**Form Data:**
| KEY | VALUE |
|-----|-------|
| `description` | `حادث بسيط للاختبار` |
| `location` | `{"latitude": 24.7136, "longitude": 46.6753, "address": "الرياض", "accuracy": 10}` |

This should create a report with no files attached.

---

## Verify Files Were Saved

After creating a report, check:

1. **Backend terminal** - Should show file processing logs
2. **File system**:
   ```bash
   cd backend/uploads/media
   ls -la
   ```
3. **Access file via URL**:
   ```
   http://localhost:5000/uploads/media/media_0-1711547234567-123456789.jpg
   ```

---

## Test File Access

Use the URL from the response to access files:

```
http://localhost:5000/uploads/media/media_0-1711547234567-123456789.jpg
http://localhost:5000/uploads/voice/voice-1711547234569-456789123.webm
http://localhost:5000/uploads/faces/face_capture-1711547234570-789123456.jpg
```

Copy the URL to your browser to verify the file is accessible.
