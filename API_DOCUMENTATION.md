# EstateCraft REST API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 🔒 Authentication & Headers

Protected routes require a valid JSON Web Token (JWT) provided in the standard `Authorization` header:

```http
Authorization: Bearer <your_access_token>
```

### Standard Response Format
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Descriptive error message",
  "errors": []
}
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/register`
Create a new user account.
- **Auth**: Public (Rate Limited)
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123",
  "role": "USER", // "USER", "AGENT", "SELLER"
  "phone": "+91 98765 43210",
  "agencyName": "Optional Agency Name"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "66c800000000000000000001",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
}
```
- **Errors**: `400 Bad Request`, `409 Conflict` (Email already registered), `429 Too Many Requests`.

---

### `POST /auth/login`
Authenticate an existing user.
- **Auth**: Public (Rate Limited)
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password@123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "66c800000000000000000001",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
}
```
- **Errors**: `401 Unauthorized` (Invalid credentials), `403 Forbidden` (Account suspended), `429 Too Many Requests`.

---

### `POST /auth/refresh-token`
Issue a new access token using a valid refresh token.
- **Auth**: Public
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```
- **Errors**: `400 Bad Request`, `401 Unauthorized` (Expired / invalid refresh token).

---

### `GET /auth/me`
Retrieve currently authenticated user profile.
- **Auth**: Bearer Token
- **Response (200 OK)**: Returns full user object (passwords and reset tokens omitted).
- **Errors**: `401 Unauthorized`.

---

### `PUT /auth/profile`
Update personal user details.
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "name": "Jane Updated",
  "phone": "+91 98765 00000",
  "bio": "Searching for 3 BHK properties in central Bhopal.",
  "avatar": "https://images.unsplash.com/..."
}
```
- **Response (200 OK)**: Returns updated sanitized user object.

---

## 2. Property Endpoints (`/api/v1/properties`)

### `GET /properties`
Search and filter published property catalog.
- **Auth**: Public / Optional Auth
- **Query Parameters**:
  - `search`: string (Full-text keyword search across title, description, address, city)
  - `city`: string (e.g. `Bhopal`, `Indore`)
  - `propertyType`: string (`APARTMENT`, `VILLA`, `HOUSE`, `COMMERCIAL`, `OFFICE`, `PLOT`, `PENTHOUSE`)
  - `listingType`: string (`SALE`, `RENT`)
  - `minPrice`, `maxPrice`: number
  - `bedrooms`, `bathrooms`: number
  - `amenities`: comma-separated string (e.g. `Swimming Pool,Gym,Lift`)
  - `sort`: string (`newest`, `price_asc`, `price_desc`, `popular`)
  - `page`, `limit`: number (Default: `page=1`, `limit=12`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Properties retrieved successfully",
  "data": {
    "properties": [],
    "total": 45,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

---

### `GET /properties/:id` & `GET /properties/slug/:slug`
Retrieve detailed property document by ObjectId or SEO slug.
- **Auth**: Public / Optional Auth
- **Response (200 OK)**: Returns populated property with category, location, owner/agent, and gallery images.
- **Errors**: `404 Not Found`.

---

### `POST /properties`
Create a new property listing (defaults to `approvalStatus: "PENDING"`).
- **Auth**: Bearer Token (`AGENT`, `SELLER`, `ADMIN`)
- **Request Body**:
```json
{
  "title": "3 BHK Lakeview Penthouse",
  "description": "Exclusive penthouse with terrace garden.",
  "propertyType": "PENTHOUSE",
  "listingType": "SALE",
  "price": 18500000,
  "priceUnit": "INR",
  "area": 2800,
  "areaUnit": "sqft",
  "bedrooms": 3,
  "bathrooms": 3,
  "balconies": 2,
  "address": "Plot 42, Arera Colony",
  "city": "Bhopal",
  "state": "Madhya Pradesh",
  "pincode": "462016",
  "amenities": ["Lift", "Parking", "Gym"],
  "images": [
    { "url": "https://...", "isThumbnail": true, "alt": "Cover", "order": 0 }
  ]
}
```
- **Response (201 Created)**: Returns created property with generated unique slug.

---

### `PUT /properties/:id`
Update an existing property listing.
- **Auth**: Bearer Token (`AGENT`, `SELLER`, `ADMIN` — Ownership Enforced)
- **Response (200 OK)**: Returns updated property document.
- **Errors**: `403 Forbidden` (If not resource owner/agent/admin), `404 Not Found`.

---

### `POST /properties/:id/favorite`
Toggle property wishlist bookmark for authenticated user.
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Property added to favorites",
  "data": {
    "isFavorited": true,
    "favoritesCount": 4
  }
}
```

---

### `GET /properties/favorites/my`
List favorited properties for logged-in user.
- **Auth**: Bearer Token
- **Response (200 OK)**: Returns paginated list of favorited properties.

---

## 3. Image Upload Endpoints (`/api/v1/upload`)

### `POST /upload/property`
Upload multiple listing photos to Cloudinary.
- **Auth**: Bearer Token
- **Content-Type**: `multipart/form-data`
- **Body**: `images` (Array of up to 10 image files; JPEG, PNG, WebP; Max 5MB each).
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Images uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image.jpg",
      "publicId": "real_estate/properties/...",
      "isThumbnail": true,
      "alt": "Photo description",
      "order": 0
    }
  ]
}
```
- **Errors**: `400 Bad Request` (Invalid file type or size > 5MB).

---

### `POST /upload/avatar`
Upload user profile photo.
- **Auth**: Bearer Token
- **Content-Type**: `multipart/form-data`
- **Body**: `avatar` (Single image file; Max 5MB).
- **Response (200 OK)**: Returns `{ "avatar": "https://...", "avatarPublicId": "..." }`.

---

## 4. Enquiry & Lead Endpoints (`/api/v1/enquiries`)

### `POST /enquiries`
Submit an inquiry lead for a listed property.
- **Auth**: Public / Optional Auth
- **Request Body**:
```json
{
  "propertyId": "66c800000000000000000042",
  "name": "Priya Verma",
  "email": "priya@example.com",
  "phone": "+91 98333 44444",
  "message": "I would like to schedule a property inspection."
}
```
- **Response (201 Created)**: Automatically triggers `NEW_ENQUIRY` in-app notification to property consultant.

---

### `PATCH /enquiries/:id/status`
Update inquiry lead status and response notes.
- **Auth**: Bearer Token (`AGENT`, `SELLER`, `ADMIN` — Recipient Enforced)
- **Request Body**:
```json
{
  "status": "RESPONDED", // "PENDING", "CONTACTED", "RESPONDED", "RESOLVED", "CLOSED"
  "notes": "Spoke on phone; inspection confirmed for Saturday."
}
```
- **Response (200 OK)**: Automatically notifies prospective buyer if registered.

---

## 5. Reviews & Ratings Endpoints (`/api/v1/reviews`)

### `GET /reviews/property/:propertyId`
Get reviews and rating breakdown for a property.
- **Auth**: Public
- **Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "reviews": [],
    "total": 12,
    "stats": {
      "averageRating": 4.8,
      "totalReviews": 12,
      "breakdown": {
        "5": 10,
        "4": 2,
        "3": 0,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

---

### `POST /reviews/property/:propertyId`
Submit or update a property review.
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "rating": 5, // 1 to 5
  "comment": "Exceptional architecture and great neighborhood."
}
```
- **Response (200 OK / 201 Created)**: Returns saved review and updated statistics.

---

## 6. Notifications Endpoints (`/api/v1/notifications`)

### `GET /notifications`
Fetch in-app notification inbox.
- **Auth**: Bearer Token
- **Query Parameters**: `isRead=false`, `page=1`, `limit=20`

### `GET /notifications/unread-count`
Get total unread notification counter.
- **Auth**: Bearer Token
- **Response (200 OK)**: `{ "unreadCount": 3 }`

### `PATCH /notifications/:id/read` & `PATCH /notifications/mark-all-read`
Mark single or all notifications as read.
- **Auth**: Bearer Token

---

## 7. Moderation Reports Endpoints (`/api/v1/reports`)

### `POST /reports`
Flag a property listing for moderation.
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "propertyId": "66c800000000000000000042",
  "reason": "MISLEADING_PRICE", // "INCORRECT_INFORMATION", "MISLEADING_PRICE", "FRAUD_OR_SCAM", "SPAM_OR_DUPLICATE", "OFFENSIVE_CONTENT", "UNRESPONSIVE_AGENT", "ALREADY_SOLD", "UNAVAILABLE_PROPERTY", "OTHER"
  "description": "Price quoted on phone differs from listed price."
}
```
- **Response (201 Created)**: Ticket logged in Admin moderation queue.

---

## 8. Admin Management Endpoints (`/api/v1/admin`)

*All admin endpoints require `ROLES.ADMIN` authorization.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/analytics` | Global platform metrics & revenue KPIs |
| `GET` | `/admin/users` | User directory (search, filter by role, pagination) |
| `PATCH` | `/admin/users/:id/block` | Toggle user suspension (`isBlocked: true/false`) |
| `DELETE` | `/admin/users/:id` | Permanently remove user account |
| `GET` | `/admin/properties` | Admin property catalog |
| `GET` | `/admin/properties/pending`| Unapproved listings queue |
| `PATCH` | `/admin/properties/:id/approve` | Approve listing and publish to marketplace |
| `PATCH` | `/admin/properties/:id/reject` | Reject listing with feedback message |
| `PATCH` | `/admin/properties/:id/feature` | Toggle featured property status |
| `GET` | `/admin/reports` | Flagged moderation tickets |
| `PATCH` | `/admin/reports/:id/status` | Resolve or dismiss moderation ticket |
| `GET` | `/admin/activity-logs` | Platform audit trail logs |
| `GET` | `/admin/settings` | Retrieve global platform configuration |
| `PUT` | `/admin/settings` | Update platform settings (fees, maintenance mode) |

---

## ⚠️ HTTP Status Codes Reference

- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Invalid request body or parameter validation error.
- `401 Unauthorized`: Authentication token missing or invalid.
- `403 Forbidden`: Authenticated user lacks required role or resource ownership.
- `404 Not Found`: Target resource does not exist.
- `409 Conflict`: Duplicate entry (e.g. email already exists).
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled server exception.
