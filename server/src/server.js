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
const PORT = 5000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests

// Define API endpoints
// get() routes are for retrieving data from the server
app.get('/api', (req, res) => res.send('Server is alive!')); // Simple health check route

// post() routes are for sending data to the server
app.post('/api/uppercase', (req, res) => {
    const { name } = req.body; // Extract name from request body
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    const modifiedName = name.toUpperCase();
    console.log(modifiedName); // Log modified name to console
    res.json({ modifiedName }); // Return modified name in response
});

app.post('/api/lowercase', (req, res) => {
    const { name } = req.body; // Extract name from request body
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    const modifiedName = name.toLowerCase();
    console.log(modifiedName); // Log modified name to console
    res.json({ modifiedName }); // Return modified name in response
});

app.post('/api/login', (req, res) => {
    const { userName, password } = req.body; // Extract password from request body
    if (!userName || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }
    console.log(`Received login request for user: ${userName}, password: ${password}`); // Log modified name to console
    // Simple authentication check (for demonstration purposes only), will update to validate with database later
    if (password === 'password123') {
        res.json({ body: `Welcome back, ${userName}!`}); // Return success message in response)
    } else {
        res.status(400).json({ error: 'Invalid password' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}); // Listen for incoming requests