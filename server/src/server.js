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
  password: 'password',  ///insert your password here 
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
            return res.status(401).json({ message: 'Invalid email' });
        }

        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).json({ message: `Invalid password for: ${email}` });
        }

        // If passwords match, login is successful
        console.log(`User ${email} logged in`);

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
    const { firstName, lastName, dateOfBirth, sex, address1, address2 = null, email, password } = req.body;
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
            res.status(201).json({ message: `User, ${firstName} ${lastName}, registered successfully` });
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
        res.status(200).json({ body: `Name: ${user.first_name}; ` + ` Email: ${user.email}; ` + ` Password: ${user.password}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error during info request' });
    }
});

// Endpoint to fetch appointments for a specific doctor or patient
app.get('/api/appointments', async (req, res) => {
    const { doctorId, patientId } = req.query; // Get doctorId or patientId from query parameters

    if (!doctorId && !patientId) {
        return res.status(400).json({ error: 'Doctor ID or Patient ID is required' });
    }

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        let query = `
            SELECT 
                a.id, 
                a.appointment_time, 
                a.status, 
                a.location,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name
            FROM Appointments a
            JOIN Users u ON a.${doctorId ? 'patient_id' : 'doctor_id'} = u.id
            WHERE a.${doctorId ? 'doctor_id' : 'patient_id'} = ?
        `;
        const params = [doctorId || patientId];

        const [rows] = await connection.execute(query, params);
        connection.release();

        // Return the appointments as JSON
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Endpoint to update an appointment
app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params; // Get the appointment ID from the URL
  const { appointment_time, status } = req.body; // Get updated data from the request body

  console.log('Request Params:', req.params); // Log the appointment ID
  console.log('Request Body:', req.body); // Log the request body

  // Validate the request body
  if (!appointment_time || !status) {
    console.error('Validation Error: Missing appointment_time or status');
    return res.status(400).json({ error: 'Appointment time and status are required' });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to update the appointment
    const [result] = await connection.execute(
      `
      UPDATE Appointments
      SET appointment_time = ?, status = ?
      WHERE id = ?
      `,
      [appointment_time, status, id]
    );

    connection.release();

    // Check if the appointment was updated
    if (result.affectedRows === 0) {
      console.error('Appointment not found for ID:', id);
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log('Appointment updated successfully for ID:', id);
    res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Endpoint to delete an appointment by a doctor
app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params; // Appointment ID
    const { doctorId } = req.query; // Doctor ID from query parameters

    console.log('Doctor ID:', doctorId); // Debug log
    console.log('Appointment ID:', id); // Debug log

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    try {
        const connection = await pool.getConnection();

        // Check if the appointment belongs to the doctor
        const [appointment] = await connection.execute(
            `
            SELECT * FROM Appointments
            WHERE id = ? AND doctor_id = ?
            `,
            [id, doctorId]
        );

        if (appointment.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Appointment not found or does not belong to the doctor' });
        }

        // Delete the appointment
        const [result] = await connection.execute(
            `
            DELETE FROM Appointments
            WHERE id = ?
            `,
            [id]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Failed to delete appointment' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

// Endpoint to fetch messages for a doctor (and optionally a specific patient)
app.get('/api/messages', async (req, res) => {
    const { doctorId, patientId } = req.query;

    if (!doctorId && !patientId) {
        return res.status(400).json({ error: 'Doctor ID or Patient ID is required' });
    }

    try {
        const connection = await pool.getConnection();

        let query = `SELECT * FROM Messages WHERE `;
        const params = [];

        if (doctorId) {
            query += `doctor_id = ? `;
            params.push(doctorId);
        }

        if (patientId) {
            if (doctorId) query += `AND `;
            query += `patient_id = ? `;
            params.push(patientId);
        }

        query += `ORDER BY date ASC`;

        const [rows] = await connection.execute(query, params);
        connection.release();

        console.log('Messages fetched:', rows); // Debug log
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Endpoint to send a message
app.post('/api/messages', async (req, res) => {
    const { doctorId, patientId, message, sentBy } = req.body;

    if (!doctorId || !patientId || !message || !sentBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            `
            INSERT INTO Messages (doctor_id, patient_id, message, sent_by, date)
            VALUES (?, ?, ?, ?, NOW())
            `,
            [doctorId, patientId, message, sentBy]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            doctorId,
            patientId,
            message,
            sentBy,
            date: new Date(),
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Updated endpoint to fetch all prescriptions or prescriptions for a specific patient
app.get('/api/prescriptions', async (req, res) => {
    const { patientId } = req.query; // Get patientId from query parameters

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        let query = `
            SELECT 
                p.id, 
                p.patient_id, 
                CONCAT(u.first_name, ' ', u.last_name) AS patient_name,
                p.doctor_id,
                CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
                p.medication, 
                p.dosage, 
                p.instructions, 
                p.prescription_date
            FROM Prescriptions p
            JOIN Users u ON p.patient_id = u.id
            JOIN Users d ON p.doctor_id = d.id
        `;

        const params = [];

        // If patientId is provided, filter by patientId
        if (patientId) {
            query += `WHERE p.patient_id = ? `;
            params.push(patientId);
        }

        query += `ORDER BY p.prescription_date DESC`;

        // Execute the query
        const [rows] = await connection.execute(query, params);
        connection.release();

        // Return the prescriptions as JSON
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// Endpoint to update a prescription
app.put('/api/prescriptions/:id', async (req, res) => {
  const { id } = req.params; // Get the prescription ID from the URL
  const { patientId, doctorId, medication, dosage, instructions } = req.body; // Get updated data from the request body

  // Validate the request body
  if (!patientId || !doctorId || !medication || !dosage || !instructions) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to update the prescription
    const [result] = await connection.execute(
      `
      UPDATE Prescriptions
      SET patient_id = ?, doctor_id = ?, medication = ?, dosage = ?, instructions = ?
      WHERE id = ?
      `,
      [patientId, doctorId, medication, dosage, instructions, id]
    );

    connection.release();

    // Check if the prescription was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Prescription updated successfully' });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

app.get('/api/appointments/:doctor_id', async (req, res) => {
    const {doctor_id} = req.params;
    try { //gets connection
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
          'SELECT * FROM appointments WHERE doctor_id = ?',
          [doctor_id]
      );
      connection.release(); 
  } catch (error) {
    console.log('Error - Appointments could not be fetched:', error);
    return res.status(500).json({error: 'Appointments could not be fetched'});
  }
});

  
app.get('/api/lab-tests', async (req, res) => {
    const { doctorId, patientId } = req.query;

    if (!doctorId && !patientId) {
        return res.status(400).json({ error: 'Doctor ID or Patient ID is required' });

    }

    try {
        const connection = await pool.getConnection();

        let query = `
            SELECT 
                l.id, 
                l.patient_id, 
                CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
                l.test_type, 
                l.result, 
                l.test_date
            FROM LabTestResults l
            JOIN Users p ON l.patient_id = p.id
        `;
        const params = [];

        if (doctorId) {
            query += `WHERE l.doctor_id = ? `;
            params.push(doctorId);
        } else if (patientId) {
            query += `WHERE l.patient_id = ? `;
            params.push(patientId);
        }

        query += `ORDER BY l.test_date DESC`;

        const [rows] = await connection.execute(query, params);
        connection.release();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching lab test results:', error);
        res.status(500).json({ error: 'Failed to fetch lab test results' });
    }
});

app.post('/api/lab-tests', async (req, res) => {
    const { patientId, doctorId, testType, result, testDate } = req.body;

    if (!patientId || !doctorId || !testType || !result || !testDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const connection = await pool.getConnection();
        const [resultData] = await connection.execute(
            `
            INSERT INTO LabTestResults (patient_id, doctor_id, test_type, result, test_date)
            VALUES (?, ?, ?, ?, ?)
            `,
            [patientId, doctorId, testType, result, testDate]
        );
        connection.release();

        res.status(201).json({ message: 'Lab test result added successfully', id: resultData.insertId });
    } catch (error) {
        console.error('Error adding lab test result:', error);
        res.status(500).json({ error: 'Failed to add lab test result' });
    }
});

// Endpoint to fetch doctor details
app.get('/api/doctor-details', async (req, res) => {
    const { doctorId } = req.query;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `
            SELECT CONCAT(first_name, ' ', last_name) AS doctor_name
            FROM Users
            WHERE id = ? AND role = 'Doctor'
            `,
            [doctorId]
        );
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        res.status(200).json({ doctorName: rows[0].doctor_name });
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ error: 'Failed to fetch doctor details' });
    }
});

// Endpoint to send appointment data
app.post('/api/sendAppointmentData', async (req, res) => {
    const { patientID, doctorID, appointmentLocation, appointment_time, status } = req.body;

    if (!patientID || !doctorID || !appointmentLocation || !appointment_time || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, location, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
            [patientID, doctorID, appointmentLocation, appointment_time, status]
        );

        res.status(200).json({ message: 'Appointment scheduled successfully!' });
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to add a new doctor
app.post('/api/doctors', async (req, res) => {
    console.log('Request body:', req.body); // Debug log
    const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth = '1980-07-01', // Default value
        sex,
        address1,
        address2 = null, // Optional
        specialty = 'Doctor', // Default value
    } = req.body;

    if (!firstName || !lastName || !email || !password || !dateOfBirth || !sex || !address1) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
        const connection = await pool.getConnection();

        // Insert the doctor into the Users table with the role "Doctor"
        const [result] = await connection.execute(
            `
            INSERT INTO Users (first_name, last_name, email, password, date_of_birth, sex, address1, address2, role, specialty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Doctor', ?)
            `,
            [firstName, lastName, email, password, dateOfBirth, sex, address1, address2, specialty]
        );

        connection.release();
        res.status(201).json({ message: 'Doctor added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Failed to add doctor' });
    }
});

// Endpoint to add a new patient
app.post('/api/patients', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        sex,
        address1,
        address2 = null,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !dateOfBirth || !sex || !address1) {
        return res.status(400).json({ error: 'All required fields must be provided' });
    }

    try {
        const connection = await pool.getConnection();

        // Insert the patient into the Users table with the role "Patient"
        const [result] = await connection.execute(
            `
            INSERT INTO Users (first_name, last_name, email, password, date_of_birth, sex, address1, address2, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Patient')
            `,
            [firstName, lastName, email, password, dateOfBirth, sex, address1, address2]
        );

        connection.release();
        res.status(201).json({ message: 'Patient added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Failed to add patient' });
    }
});

// Endpoint to fetch all doctors
app.get('/api/doctors', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `
            SELECT 
                id, 
                first_name, 
                last_name, 
                email, 
                date_of_birth, 
                sex, 
                address1, 
                address2, 
                role, 
                specialty
            FROM 
                Users
            WHERE 
                role = 'Doctor'
            `
        );
        connection.release();
        console.log('Fetched doctors:', rows); // Debug log
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// Endpoint to delete a doctor
app.delete('/api/doctors/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();

        const [result] = await connection.execute(
            `
            DELETE FROM Users
            WHERE id = ? AND role = 'Doctor'
            `,
            [id]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
});

// Endpoint to fetch all patients
app.get('/api/patients', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `
            SELECT 
                id, 
                first_name, 
                last_name, 
                email, 
                date_of_birth, 
                sex, 
                address1, 
                address2
            FROM 
                Users
            WHERE 
                role = 'Patient'
            `
        );
        connection.release();
        console.log('Fetched patients:', rows); // Debug log
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// Endpoint to delete a patient
app.delete('/api/patients/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();

        const [result] = await connection.execute(
            `
            DELETE FROM Users
            WHERE id = ? AND role = 'Patient'
            `,
            [id]
        );

        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

app.post('/api/name', async (req, res) => {
  const { user_id } = req.body; // Accessing user_id from req.body
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT first_name, last_name FROM users WHERE id = ?',
      [user_id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No username found' });
    }

    return res.status(200).json({ name: `${rows[0].first_name} ${rows[0].last_name}` }); // Returning full name
  } catch (error) {
    console.error('Error getting name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database schema update
async function updateDatabaseSchema() {
    try {
        const connection = await pool.getConnection();

        // Check if the 'specialty' column already exists
        const [rows] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'specialty'
        `);

        if (rows.length === 0) {
            // Add the 'specialty' column with a default value of 'Doctor' if it doesn't exist
            await connection.execute(`
                ALTER TABLE Users 
                ADD COLUMN specialty VARCHAR(255) DEFAULT 'Doctor'
            `);
            console.log('Database schema updated: Added specialty column with default value to Users table');
        } else {
            // Ensure the column has a default value
            await connection.execute(`
                ALTER TABLE Users 
                MODIFY COLUMN specialty VARCHAR(255) DEFAULT 'Doctor'
            `);
            console.log('Database schema updated: Ensured specialty column has default value');
        }

        connection.release();
    } catch (error) {
        console.error('Error updating database schema:', error);
    }
}

updateDatabaseSchema();

const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    console.log('Attempting to delete appointment with ID:', appointmentId);
    console.log('Doctor ID:', doctorId);

    try {
        const response = await fetch(`/api/appointments/${appointmentId}?doctorId=${doctorId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Appointment deleted successfully!');
            setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
            setSelectedAppointment(null);
        } else {
            const errorData = await response.json();
            console.error('Error response from server:', errorData);
            alert(errorData.error || 'Failed to delete appointment.');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment.');
    }
};