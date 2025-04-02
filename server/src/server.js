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
  password: 'Beastmode#5292',
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

      // Retrieve the user record along with their role
      const [rows] = await connection.execute(
          'SELECT id, role, password FROM users WHERE email = ?',
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

      // Send back user data, including role
      res.status(200).json({
          message: 'Login successful',
          userId: user.id,
          role: user.role,  // Include role in the response
      });
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

// Endpoint to fetch appointments for a specific doctor
app.get('/api/appointments', async (req, res) => {
  const { doctorId } = req.query; // Get doctorId from query parameters

  if (!doctorId) {
    return res.status(400).json({ error: 'Doctor ID is required' });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch appointments for the given doctor
    const [rows] = await connection.execute(
      `
      SELECT 
        a.id, 
        a.appointment_time, 
        a.status, 
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name
      FROM Appointments a
      JOIN Users p ON a.patient_id = p.id
      WHERE a.doctor_id = ?
      `,
      [doctorId]
    );

    connection.release();

    // Return the appointments as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Endpoint to fetch all messages
app.get('/api/messages', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch all messages
    const [rows] = await connection.execute(
      `
      SELECT 
        m.id, 
        m.patient_id, 
        m.doctor_id, 
        m.message, 
        m.sent_by, 
        m.date, 
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM Messages m
      JOIN Users p ON m.patient_id = p.id
      JOIN Users d ON m.doctor_id = d.id
      ORDER BY m.date DESC
      `
    );

    connection.release();

    // Return the messages as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Endpoint to send a message
app.post('/api/messages', async (req, res) => {
  const { patientId, doctorId, message } = req.body;

  // Validate the request body
  if (!patientId || !doctorId || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Insert the message into the Messages table
    const [result] = await connection.execute(
      `
      INSERT INTO Messages (patient_id, doctor_id, message, sent_by, date) 
      VALUES (?, ?, ?, "doctor", NOW())
      `,
      [patientId, doctorId, message]
    );

    connection.release();

    // Return the newly created message as JSON
    res.status(201).json({
      id: result.insertId,
      patientId,
      doctorId,
      message,
      sentBy: 'doctor',
      date: new Date(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
