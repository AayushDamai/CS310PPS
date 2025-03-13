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
const mysql = require('mysql2/promise');
const app = express();
const PORT = 5000;

// Create a connection pool to your database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'cs310ppsdb',
  waitForConnections: true
});

async function testDBConnection() {
  try {
    // Retrieve a connection from the pool
    const connection = await pool.getConnection();
    console.log('Connected to the database via pool!');

    // Release the connection back to the pool
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

testDBConnection();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests

// Define API endpoints
// get() routes are for retrieving data from the server
app.get('/api', (req, res) => res.send('Server is alive!')); // Simple health check route

// post() routes are for sending data to the server
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
      
      // Retrieve the user record
      const [rows] = await connection.execute(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );
      connection.release();
      
      if (rows.length == 0) {
        console.log(`Failed login attempt for: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      const user = rows[0];
  
      if (user.password !== password) {
        console.log(`Failed login attempt for: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // If passwords match, login is successful
      console.log(`User ${user.email} logged in`);
      res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
      res.status(500).json({ error: 'Server error during login' });
    }
});

// Register a new user
app.post('/api/register', async (req, res) => {
  const {firstName, lastName, dateOfBirth, sex, address1, address2 = null, email, password} = req.body;
  const role = 'Patient'; // default role is Patient for now

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      // Insert into the base Users table
      const [userResult] = await connection.execute(
        'INSERT INTO users (first_name, last_name, email, password, date_of_birth, sex, address1, address2, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, password, dateOfBirth, sex, address1, address2, role]
      );
      const userId = userResult.insertId;

      // If the user is a Patient, insert into the patients table with default values for insurance and medical history
      if (role === 'Patient') {
        const insurance_provider = 'None';
        const medical_history = 'None';
        await connection.execute(
          'INSERT INTO patients (user_id, insurance_provider, medical_history) VALUES (?, ?, ?)',
          [userId, insurance_provider, medical_history]
        );
      }

      // Commit the transaction
      await connection.commit();
      console.log(`User ${email} registered`);
      res.status(201).json({ message: `User, ${firstName} ${lastName}, registered successfully`});
    } catch (err) {
      // Rollback in case of error
      await connection.rollback();
      res.status(500).json({ message: 'Registration failed' });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/api/sendUserData', async (req, res) => {
    const { email } = req.body; // Extract email from request body
    if (!email) {
        return res.status(400).json({ error: "Email Required" });
    }
    console.log(`Received info request for: ${email}`); // Log user's email to console

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
        
        // Retrieve the user record
        const [rows] = await connection.execute(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        connection.release();
    
        if (rows.length === 0) {
          return res.status(401).json({ message: 'Invalid email' });
        }
    
        const user = rows[0];
        // Send user data back to the client
        res.status(200).json({ body: `Name: ${user.first_name}, ` + ` Email: ${user.email}, ` + ` Password: ${user.password}`});
    } catch (error) {
        res.status(500).json({ message: 'Server error during info request' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}); // Listen for incoming requests
