# Plumbify Tour Backend API

This is a lightweight Go backend API designed to support the **Plumbify Interactive Product Tour** simulation. It runs locally and serves endpoints for missed-call simulation, SMS chat automation, Google Review triggers, and live dashboard stats.

## Getting Started

### Prerequisites
- Go 1.21 or higher installed on your system.

### How to Run
From this directory (`plumbify-site/backend`), run:
```bash
go run main.go
```
The server will start on `http://localhost:8080`.

## API Documentation

### 1. Intercept Missed Call
* **Endpoint**: `POST /api/tour/simulate-call`
* **Payload**:
  ```json
  {
    "phone": "+1 (555) 019-2834"
  }
  ```
* **Response**:
  ```json
  {
    "status": "missed_call_registered",
    "message": "Missed call from +1 (555) 019-2834 intercepted by Plumbify.",
    "timestamp": "2026-06-17T15:45:00Z",
    "autoResponse": "Hi, this is Plumbify! Sorry we missed your call. Need an emergency plumber?"
  }
  ```

### 2. Simulate SMS Dialog Flow (AI Onboarding Chat)
* **Endpoint**: `POST /api/tour/simulate-sms`
* **Payload**:
  ```json
  {
    "phone": "+1 (555) 019-2834",
    "message": "Yes, water is leaking everywhere!",
    "step": 1
  }
  ```
* **Response**:
  ```json
  {
    "sender": "ai",
    "text": "Oh no! We can get a master plumber dispatched immediately. Is today at 2 PM or 4 PM better for you?",
    "timestamp": "2026-06-17T15:45:01Z",
    "nextStep": 2,
    "captured": false,
    "revenue": 0
  }
  ```

### 3. Review Automation Smart Routing
* **Endpoint**: `POST /api/tour/simulate-review`
* **Payload**:
  ```json
  {
    "phone": "+1 (555) 019-2834",
    "rating": 5
  }
  ```
* **Response (High Rating -> Public Google link)**:
  ```json
  {
    "status": "success",
    "message": "Great review! Rating: 5 stars. Plumbify routes customer to Google Review page.",
    "reviewLink": "https://g.page/r/plumbify/review",
    "needsFollow": false,
    "timestamp": "2026-06-17T15:45:02Z"
  }
  ```
* **Response (Low Rating -> Private Feedback form)**:
  ```json
  {
    "status": "feedback_captured",
    "message": "Low rating captured privately. Plumbify prevents public negative review and alerts the manager.",
    "needsFollow": true,
    "timestamp": "2026-06-17T15:45:02Z"
  }
  ```

### 4. Dynamic Dashboard Metrics
* **Endpoint**: `GET /api/tour/dashboard-stats`
* **Response**:
  ```json
  {
    "capturedLeads": 184,
    "savedRevenue": 150880,
    "responseTime": "4.8 seconds",
    "reviewsCount": 98,
    "averageRating": 4.87,
    "activeTechs": 8,
    "jobsDispatched": 312
  }
  ```
  *(Returns slightly dynamic counts based on the clock minute to simulate live app data updates)*

## Resilient Frontend Fallback
If the Go server is offline (e.g., when the production site is built on Vercel without a Go middleware container), the Next.js frontend is designed with client-side JavaScript simulators matching these flows exactly. This ensures that the interactive tour remains fully functional for web visitors at all times.
