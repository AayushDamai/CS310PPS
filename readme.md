# CS310 Patient Portal System  

## Overview  
A full-stack system enabling patients and medical professionals to:  
* Schedule/manage appointments  

## Features  
### Patients  
- Book/reschedule/cancel appointments  
- View lab results & prescriptions  


### Medical Staff  
- Manage patient prescriptions  
- View appointment calendar  


## Technology Stack  
| Component       | Technology          |  
|-----------------|---------------------|  
| Frontend        | React 18            |  
| Backend         | Node.js 20 + Express|  
| Database        | MySQL 8             |   

## Installation  

## 1. Install Node.js
https://nodejs.org/en/

### 2. Clone repo
```bash    
git clone https://github.com/AayushDamai/CS310PPS.git  
cd CS310PPS  
```
### 3. Download MySQL & Workbench

https://dev.mysql.com/downloads/installer/
https://www.mysql.com/products/workbench/

### 4. Workbench
In the workbench, go over to the Database tab at the top, click Connect to Database... Make sure its running on Port 3306. Click OK. Now add the scripts and then run the scripts for the data. 

### 3. Install dependencies
```bash
npm install
```
### 4. Start development
```bash
npm start
```

## Access:
- Frontend: http://localhost:3000 
- Backend API: http://localhost:5000/api


## Further Help
https://www.freecodecamp.org/news/how-to-install-react-a-step-by-step-guide/ 
## Potential Issues
- Might need to run npm install require-directory instead of simple npm install 
- You might have to run cmd as an admin
- If you're missing the calendar, run
```bash
  npm install react-big-calendar
  npm install moment
```
