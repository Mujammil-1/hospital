# Hospital Database Management System

A full-stack web application for managing hospital data including patients, doctors, appointments, admissions, and billing.

## Features

- **Patient Management**: Add, view, and manage patient information
- **Doctor Management**: Manage doctor profiles and specializations
- **Appointment Scheduling**: Schedule and track appointments
- **Room Management**: Track room availability and types
- **Admission Tracking**: Monitor patient admissions and discharges
- **Billing System**: Manage patient bills and payment status
- **Database Views**: Access comprehensive views of hospital data

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Frontend**: React with modern UI components
- **Styling**: CSS3 with modern design principles

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone and Setup**:
   ```bash
   # All dependencies are included, just run the test script
   ./test-setup.sh
   ```

2. **Database Setup**:
   ```bash
   # Install MySQL (Ubuntu/Debian)
   sudo apt update
   sudo apt install mysql-server
   
   # Start MySQL service
   sudo systemctl start mysql
   sudo systemctl enable mysql
   
   # Create the database (you'll be prompted for MySQL password)
   mysql -u root -p < hospital_schema.sql
   ```

3. **Environment Configuration**:
   - Update the `.env` file with your MySQL credentials:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=HospitalDB
   PORT=5000
   ```

4. **Start the Application**:
   ```bash
   # Option 1: Use the start script (recommended)
   ./start.sh
   
   # Option 2: Manual start
   npm run dev-all
   ```

### Detailed Setup

#### Backend Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Configure database connection in `.env` file

3. Start the backend server only:
   ```bash
   npm run server
   ```

#### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

2. Start the React development server only:
   ```bash
   npm run client
   ```

#### Development Mode

Run both backend and frontend simultaneously:
```bash
npm run dev-all
```

### Access the Application

- **Frontend (React App)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Troubleshooting

1. **MySQL Connection Issues**:
   - Ensure MySQL service is running: `sudo systemctl status mysql`
   - Check credentials in `.env` file
   - Test connection: `mysql -u root -p`

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill existing processes: `pkill -f node`

3. **Dependencies Issues**:
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - For client: `cd client && rm -rf node_modules && npm install`

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Add new department

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Add new room
- `PUT /api/rooms/:id` - Update room

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Schedule new appointment
- `PUT /api/appointments/:id` - Update appointment

### Admissions
- `GET /api/admissions` - Get all admissions
- `POST /api/admissions` - Add new admission
- `PUT /api/admissions/:id` - Update admission

### Bills
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Add new bill
- `PUT /api/bills/:id` - Update bill

### Views
- `GET /api/views/doctors` - Get doctor view
- `GET /api/views/appointments` - Get appointment view
- `GET /api/views/admissions` - Get admission view
- `GET /api/views/bills` - Get bill view

## Database Schema

The application uses a MySQL database with the following tables:
- Patient
- Department
- Doctor
- Room
- Appointment
- Admission
- Bill

## License

MIT License