import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT
const CAT_FACT_API = process.env.CAT_FACT_API
const API_TIMEOUT = 5000

// Middleware
app.use(express.json())
app.use(cors())

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper function to fetch cat fact with timeout
async function fetchCatFact() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(CAT_FACT_API, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Cat Facts API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.fact;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('[ERROR] Cat Facts API request timed out');
      throw new Error('Request timeout');
    }
    
    console.error('[ERROR] Failed to fetch cat fact:', error.message);
    throw error;
  }
}

// Profile endpoint
app.get('/me', async (req, res) => {
  try {
    // Fetch cat fact
    const catFact = await fetchCatFact();
    
    // Generate current UTC timestamp in ISO 8601 format
    const timestamp = new Date().toISOString();
    
    // Return success response
    res.status(200).json({
      status: 'success',
      user: {
        email: process.env.USER_EMAIL,
        name: process.env.USER_NAME,
        stack: process.env.USER_STACK
      },
      timestamp,
      fact: catFact
    });
    
    console.log('SUCCESS! Profile data sent successfully');
  } catch (error) {
    // Handle errors gracefully
    const timestamp = new Date().toISOString();
    console.error('ERROR! Failed to process /me request:', error.message);
    
    // Return error response with fallback
    res.status(503).json({
      status: 'error',
      user: {
        email: process.env.USER_EMAIL,
        name: process.env.USER_NAME,
        stack: process.env.USER_STACK
      },
      timestamp,
      fact: 'Cat fact temporarily unavailable. Did you know cats spend 70% of their lives sleeping?',
      error: 'Unable to fetch cat fact from external API'
    });
  }
});

app.get("/", (req, res) => {
    console.log("Welcome to my HNGi7 Stage 0 Task");
    res.status(200).json("Welcome to my HNGi13 Stage 0 Task")
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});
    

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})