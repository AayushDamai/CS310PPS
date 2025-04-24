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
  password: 'Beastmode#5292',  ///insert your password here 
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
app.use(cors());
app.use(express.json());

// Define API endpoints
app.post('/api/addprescriptions', async (req, res) => {
    console.log('POST /api/addprescriptions called'); // Debug log
    console.log('Request body:', req.body); // Debug log

    const { patient_id, doctor_id, medication, dosage, instructions, prescription_date } = req.body;

    if (!patient_id || !doctor_id || !medication || !dosage || !prescription_date) {
        console.error('Validation failed: Missing required fields');
        return res.status(400).json({ message: 'All fields are required except instructions' });
    }

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            `
            INSERT INTO Prescriptions (patient_id, doctor_id, medication, dosage, instructions, prescription_date)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [patient_id, doctor_id, medication, dosage, instructions || null, prescription_date]
        );
        connection.release();

        console.log('Prescription added successfully:', result); // Debug log
        res.status(201).json({ message: 'Prescription added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding prescription:', error); // Debug log
        res.status(500).json({ message: 'Failed to add prescription' });
    }
});