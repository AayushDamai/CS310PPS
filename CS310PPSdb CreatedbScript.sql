CREATE DATABASE cs310ppsdb;

USE cs310ppsdb;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  sex ENUM('Male', 'Female', 'Prefer Not To Say') NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  role ENUM('Admin', 'Doctor', 'Nurse', 'Patient') NOT NULL
);

CREATE TABLE Admins (
  user_id INT PRIMARY KEY,
  admin_level VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Doctors (
  user_id INT PRIMARY KEY,
  specialization VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Nurses (
	user_id INT PRIMARY KEY,
	license_number VARCHAR(100) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Patients (
  user_id INT PRIMARY KEY,
  insurance_provider VARCHAR(255),
  medical_history TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Appointments (
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

CREATE TABLE LabTestResults (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  test_type VARCHAR(255) NOT NULL,
  result TEXT NOT NULL,
  test_date DATE NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES Users(id),
  FOREIGN KEY (doctor_id) REFERENCES Users(id)
);

CREATE TABLE Prescriptions (
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