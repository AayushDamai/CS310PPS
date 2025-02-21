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

// In-memory data storage (for demonstration purposes only)
const userData = [{ userName: 'test', password: 'test', firstName: 'FirstTest', lastName: 'LastTest', dateOfBirth: '00/00/0000', sex: 'M', address1: '1234 Test St.', address2: 'Apt. 123', email: 'test@test.test', phone: '123-456-7890' }];


// Define API endpoints
// get() routes are for retrieving data from the server
app.get('/api', (req, res) => res.send('Server is alive!')); // Simple health check route

// post() routes are for sending data to the server
app.post('/api/sendLoginData', (req, res) => {
    const { userName, password } = req.body; // Extract password from request body
    if (!userName || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }
    console.log(`Received login request for user: ${userName}, password: ${password}`); // Log modified name to console
    // Simple authentication check (for demonstration purposes only), will update to validate with database later
    console.log("User:", user = userData.find(user => user.userName === userName));
    if (user && user.password === password) {
        console.log(`Successful login for user: ${user.userName}`); // Log success message to console
        res.json({ body: `Welcome back, ${user.userName}!`}); // Return success message in response)
    } else {
        console.log(`Failed login attempt for user: ${userName}`); // Log failure message to console
        res.status(400).json({ error: 'Invalid username or password' });
    }
});

app.post('/api/sendRegistrationData', (req, res) => {
    const { user } = req.body; // Extract password from request body
    if (!user.firstName || !user.lastName) {
        return res.status(400).json({ error: "Data not retrieved" });
    }
    console.log(`Received registration request for: ${user.firstName} + ${user.lastName}`); // Log users name to console
    userData.push(user); // Add user to in-memory data storage
    res.json({ body: `Welcome, ${user.firstName}!`}); // Return success message in response)
});

app.post('/api/sendUserData', (req, res) => {
    const { email } = req.body; // Extract password from request body
    if (!email) {
        return res.status(400).json({ error: "Email Required" });
    }
    console.log(`Received info request for: ${email}`); // Log user's name to console
    
    const user = userData.find(user => user.email === email);
    if (!user) {
        console.log(`Failed info request for user: ${email}`); // Log failure message to console
        res.status(400).json({ error: 'Invalid email' });
    }
    res.json({ body: `Name: ${user.firstName} ` + ` Username: ${user.userName} ` + ` Password: ${user.password}`}); // Return success message in response)
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}); // Listen for incoming requests
