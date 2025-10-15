# Profile API with Cat Facts

A simple RESTful API built with Node.js/Express that returns profile information along with dynamic cat facts.

## Features
- Profile endpoint at `/me`
- Dynamic cat facts from external API
- UTC timestamps in ISO 8601 format
- Graceful error handling with fallback
- Configurable timeout (5 seconds)
- CORS enabled
- Environment variable configuration
- Request logging

## Prerequisites
- Node.js 18.x or higher
- npm

## Project Setup
```
├── app.js            # Main application file
├── package.json      # Project dependencies and scripts
├── .env.example      # Environment variables template
├── .env              # environment variables (git-ignored)
└── README.md         # Documentation
```

## Installation
- Clone or create the project directory
- Install dependencies
 

```
npm install
```
- Configure environment variables

```
cp.env.example .env
```
- Edit `.env` file with your information

  

```
   PORT=8000
   USER_EMAIL=yourname@example.com
   USER_NAME=Your Full Name
   USER_STACK=Node.js/Express
```

## Usage
### Start the server
#### Production mode:

```
npm start
```
#### Development mode

```
npm run dev
```
The server will start on `http://localhost:8000`

## API Endpoints
GET `/me`
Returns profile information with a dynamic cat fact.
Response (Success - 200):


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wxgifw8396549j1dizhx.png)

Response (Error - 503):

```
{
  "status": "error",
  "user": {
    "email": "your.email@example.com",
    "name": "Your Full Name",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-15T14:30:45.123Z",
  "fact": "Cat fact temporarily unavailable. Did you know cats spend 70% of their lives sleeping?",
  "error": "Unable to fetch cat fact from external API"
}
```

GET `/health`
Health check endpoint.
Response (200):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xj5ltpm5wbyf1i3zy8q0.png)

## Testing
Test the endpoint using postman:

```
// Test profile endpoint
http://localhost:8000/me

// Test health check
http://localhost:8000/health
```

## Error Handling
The API handles the following error scenarios:

- **Network errors:** Returns 503 with fallback message
- **Timeout (5s):** Returns 503 with fallback message
- **External API failure:** Returns 503 with fallback message
- **Invalid routes:** Returns 404 with error message
- **Server errors:** Returns 500 with error message