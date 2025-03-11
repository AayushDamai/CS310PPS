# CS310 Patient Portal System  

## Overview  
A full-stack system enabling patients and medical professionals to:  
* Schedule/manage appointments  
* Access medical records securely  
* Communicate via encrypted messaging  

## Features  
### Patients  
- Book/reschedule/cancel appointments  
- View lab results & prescriptions  
- Message doctors securely  
- Receive email reminders  

### Medical Staff  
- Manage patient EHR (Electronic Health Records)  
- Manage patient prescriptions  
- View appointment calendar  
- Export visit summaries  

## Technology Stack  
| Component       | Technology          |  
|-----------------|---------------------|  
| Frontend        | React 18            |  
| Backend         | Node.js 20 + Express|  
| Database        | MySQL 8             |   

## Installation  

## 1. 
-- Add Node.js installation
-- Add issue with having to run System as an admin and then add PS C:\> Set-ExecutionPolicy RemoteSigned code

### 1. Clone repo
```bash    
git clone https://github.com/AayushDamai/CS310PPS.git  
cd CS310PPS  
```
### 2. Install dependencies
```bash
npm install
```
### 3. Start development
```bash
npm start
```

## Access:
- Frontend: http://localhost:3000 
- Backend API: http://localhost:5000/api

## Security
- HIPAA-compliant data handling
- Role-based access control (RBAC)


## Further Help
https://www.freecodecamp.org/news/how-to-install-react-a-step-by-step-guide/ 
## Potential Issues
-- might need to run npm install require-directory