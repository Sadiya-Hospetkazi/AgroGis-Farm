# AgroGig API Documentation

## Overview
This document describes the RESTful API endpoints for the AgroGig application. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "farmer": {
    "id": 1,
    "name": "string",
    "email": "string",
    "phone": "string",
    "language": "string",
    "location": "string"
  }
}
```

### Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Farmer registered successfully",
  "token": "jwt_token",
  "farmer": {
    "id": 1,
    "name": "string",
    "email": "string",
    "phone": "string",
    "language": "string",
    "location": "string"
  }
}
```

### Logout
```
POST /auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User
```
GET /auth/me
```

**Response:**
```json
{
  "success": true,
  "farmer": {
    "id": 1,
    "name": "string",
    "email": "string",
    "phone": "string",
    "language": "string",
    "location": "string"
  }
}
```

## Actions

### Log Action
```
POST /actions/log
```

**Request Body:**
```json
{
  "farmerId": 1,
  "type": "string", // watering, weeding, fertilizing, irrigation, monitoring, seeding
  "date": "2025-03-15T08:30:00",
  "description": "string",
  "cropType": "string", // tomato, rice, wheat, corn, cotton, mixed
  "fieldArea": 2.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Action logged successfully",
  "action": {
    "id": 1,
    "farmerId": 1,
    "type": "string",
    "date": "2025-03-15T08:30:00",
    "description": "string",
    "cropType": "string",
    "fieldArea": 2.5,
    "score": 12,
    "status": "pending"
  }
}
```

### Get Farmer Actions
```
GET /actions/farmer/:farmerId
```

**Response:**
```json
{
  "success": true,
  "actions": [
    {
      "id": 1,
      "farmerId": 1,
      "type": "string",
      "date": "2025-03-15T08:30:00",
      "description": "string",
      "cropType": "string",
      "fieldArea": 2.5,
      "score": 12,
      "status": "verified"
    }
  ]
}
```

### Get Recent Actions
```
GET /actions/recent
```

**Response:**
```json
{
  "success": true,
  "actions": [
    {
      "id": 1,
      "farmerId": 1,
      "type": "string",
      "date": "2025-03-15T08:30:00",
      "description": "string",
      "cropType": "string",
      "fieldArea": 2.5,
      "score": 12,
      "status": "verified"
    }
  ]
}
```

### Get Action by ID
```
GET /actions/:id
```

**Response:**
```json
{
  "success": true,
  "action": {
    "id": 1,
    "farmerId": 1,
    "type": "string",
    "date": "2025-03-15T08:30:00",
    "description": "string",
    "cropType": "string",
    "fieldArea": 2.5,
    "score": 12,
    "status": "verified"
  }
}
```

### Update Action
```
PUT /actions/:id
```

**Request Body:**
```json
{
  "type": "string",
  "date": "2025-03-15T08:30:00",
  "description": "string",
  "cropType": "string",
  "fieldArea": 2.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Action updated successfully",
  "action": {
    "id": 1,
    "farmerId": 1,
    "type": "string",
    "date": "2025-03-15T08:30:00",
    "description": "string",
    "cropType": "string",
    "fieldArea": 2.5,
    "score": 12,
    "status": "verified"
  }
}
```

### Delete Action
```
DELETE /actions/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Action deleted successfully",
  "action": {
    "id": 1,
    "farmerId": 1,
    "type": "string",
    "date": "2025-03-15T08:30:00",
    "description": "string",
    "cropType": "string",
    "fieldArea": 2.5,
    "score": 12,
    "status": "verified"
  }
}
```

## Scores

### Get Farmer Scores
```
GET /scores/farmer/:farmerId
```

**Response:**
```json
{
  "success": true,
  "scores": [
    {
      "id": 1,
      "farmerId": 1,
      "actionId": 1,
      "score": 12,
      "category": "string",
      "date": "2025-03-15T08:30:00"
    }
  ],
  "totalScore": 12
}
```

### Get Score by Action ID
```
GET /scores/action/:actionId
```

**Response:**
```json
{
  "success": true,
  "score": {
    "id": 1,
    "farmerId": 1,
    "actionId": 1,
    "score": 12,
    "category": "string",
    "date": "2025-03-15T08:30:00"
  }
}
```

### Get Monthly Scores
```
GET /scores/monthly/:farmerId
```

**Response:**
```json
{
  "success": true,
  "monthlyScores": {
    "2025-03": 45,
    "2025-02": 38
  }
}
```

### Get Score Categories
```
GET /scores/categories/:farmerId
```

**Response:**
```json
{
  "success": true,
  "categoryScores": {
    "water": 25,
    "weed": 18,
    "fertilizer": 22
  }
}
```

### Get Farmer Badges
```
GET /scores/badges/:farmerId
```

**Response:**
```json
{
  "success": true,
  "badges": [
    {
      "id": 1,
      "farmerId": 1,
      "name": "string",
      "description": "string",
      "earnedDate": "2025-03-15T08:30:00"
    }
  ]
}
```

## Reports

### Get Monthly Report
```
GET /reports/monthly/:farmerId
```

**Response:**
```json
{
  "success": true,
  "report": {
    "month": "2025-03",
    "totalActions": 12,
    "totalScore": 125,
    "avgDailyScore": 4.2,
    "actionDistribution": {
      "watering": 5,
      "weeding": 3,
      "fertilizing": 4
    }
  }
}
```

### Get Action Distribution
```
GET /reports/distribution/:farmerId
```

**Response:**
```json
{
  "success": true,
  "distribution": {
    "watering": 5,
    "weeding": 3,
    "fertilizing": 4
  }
}
```

### Get Recommendations
```
GET /reports/recommendations/:farmerId
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    "string"
  ]
}
```

### Claim Reward
```
POST /reports/rewards/claim
```

**Request Body:**
```json
{
  "rewardId": "string",
  "farmerId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reward claimed successfully!",
  "couponCode": "string",
  "rewardDetails": {
    "rewardId": "string",
    "farmerId": 1,
    "claimedDate": "2025-03-15T08:30:00",
    "expiryDate": "2025-04-15T08:30:00"
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting
The API implements rate limiting to prevent abuse:
- 100 requests per hour per IP address
- 10 requests per minute per endpoint

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```