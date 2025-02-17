/**
 * Express server entry point
 * Configures middleware and API routes
 * Database connection setup
 * Starts HTTP listener
 * Not sure how this part works to be honest
*/

// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Define API endpoint
app.get('/api', (req, res) => res.send('Server is alive!')); // Simple health check route

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Listen for incoming requests