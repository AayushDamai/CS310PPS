# Patient Portal System

## Overview
The Patient Portal System is a website and/or app developed to enhance communication between patients and healthcare stuff. This system enables patients to:
- Schedule and manage appointments
- Access medical records securely
- Communicate with healthcare professionals

The system can enables Doctors and nurses to:
- efficiently manage patient records
- access patient appointments
- ensuring uninterrupted healthcare services

## Features
**User Authentication**
- Secure login and registration for patients and medical professionals
- Multi-factor authentication for enhanced security
**Appointment Scheduling**
- Patients can schedule, modify, or cancel appointments
- Healthcare staff can manage availability and view scheduled appointments
**Medical Record Management**
- Patients can view medical history, test results, and prescriptions
- Doctors can upload, update, and manage patient records securely
**Communication Tools**
- Secure messaging between patients and healthcare providers
- Notifications and reminders for upcoming appointments and test results
**Reporting & Accessibility**
- Generate reports such as appointment history and lab results
- Fully responsive design accessible via desktop, tablet, and mobile devices

## Technology Stack
- Front-end: React.js
- Back-end: Node.js
- Database: MySQL
- Version Control: GitHub
- Communication Protocols: RESTful APIs

## Security & Compliance
- HIPAA Compliance: Ensures confidentiality and integrity of patient data
- Data Encryption: Secure encryption of sensitive data at rest and in transit
- Access Control: Role-based access to safeguard patient information

## System Requirements
**Software Requirements**
- Operating System: Windows, macOS, or Linux
- Web Browser: Chrome, Firefox, or Safari (latest versions)
- Node.js and npm installed
- MySQL database server

## Installation & Setup
**Prerequisites**
Ensure you have the following installed:
- Node.js
- MySQL
- Git

**Steps to Run Locally**
1.	Clone the Repository:
    ```bash
    git clone https://github.com/AayushDamai/CS310PPS.git
    cd CS310PPS
    ```
3.	**Install Dependencies:**
    ```bash
    npm install
    ```
4.	**Set Up Database:**
    - Create a MySQL database and update connection details in the .env file.
    - Run database migrations.
5.	**Start the Server:**
    ```bash
    npm start
    ```
6.	**Access the Application:**
    - Open http://localhost:3000 in your web browser.

## Assumptions & Dependencies
- The system assumes users have a stable internet connection
- The application depends on third-party services for authentication and messaging
- Future updates may require API modifications for compliance and security

## Contribution Guidelines
- Fork the repository and create a feature branch
- Follow clean code principles and industry standards
- Submit pull requests with clear documentation and testing

Contribute, innovate, and help make healthcare more accessible!

