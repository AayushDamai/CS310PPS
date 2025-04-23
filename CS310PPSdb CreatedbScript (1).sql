-- Step 1: Create and select the database
CREATE DATABASE IF NOT EXISTS cs310ppsdb;
USE cs310ppsdb;

-- Step 2: Drop all existing tables in correct order (to avoid FK errors)
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Prescriptions;
DROP TABLE IF EXISTS LabTestResults;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Nurses;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Users;

-- Step 3: Recreate tables

-- Users table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  sex ENUM('Male', 'Female', 'Prefer Not To Say') NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  role ENUM('Admin', 'Doctor', 'Nurse', 'Patient') NOT NULL,
  clearance_level ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Low'
);

-- Admins table
CREATE TABLE IF NOT EXISTS Admins (
  user_id INT PRIMARY KEY,
  admin_level VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Doctors table
CREATE TABLE IF NOT EXISTS Doctors (
  user_id INT PRIMARY KEY,
  specialization VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Nurses table
CREATE TABLE IF NOT EXISTS Nurses (
  user_id INT PRIMARY KEY,
  license_number VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Patients table
CREATE TABLE IF NOT EXISTS Patients (
  user_id INT PRIMARY KEY,
  insurance_provider VARCHAR(255),
  medical_history TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS Appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  nurse_id INT,
  appointment_time DATETIME NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  FOREIGN KEY (patient_id) REFERENCES Users(id),
  FOREIGN KEY (doctor_id) REFERENCES Users(id),
  FOREIGN KEY (nurse_id) REFERENCES Users(id)
);

-- Lab Test Results table
CREATE TABLE IF NOT EXISTS LabTestResults (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  test_type VARCHAR(255) NOT NULL,
  result TEXT NOT NULL,
  test_date DATE NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES Users(id),
  FOREIGN KEY (doctor_id) REFERENCES Users(id)
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS Prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  medication VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  instructions TEXT,
  prescription_date DATE NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES Users(id),
  FOREIGN KEY (doctor_id) REFERENCES Users(id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS Messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  message TEXT NOT NULL,
  sent_by ENUM('doctor', 'patient') NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES Users(id),
  FOREIGN KEY (doctor_id) REFERENCES Users(id)
);
