# 🏥 Hospital Database Management System

A full-stack web application for managing hospital operations including patients, doctors, departments, rooms, appointments, admissions, and billing.

## 🚀 Features

- **Patient Management**: Add, view, and manage patient records
- **Doctor Management**: Manage doctor information with department assignments
- **Department Management**: Organize hospital departments
- **Room Management**: Track room availability and types
- **Appointment Scheduling**: Schedule and manage patient appointments
- **Admission Tracking**: Monitor patient admissions and discharges
- **Billing System**: Manage bills and payment status
- **Database Views**: View comprehensive reports and aggregated data

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- MySQL 2
- CORS & Body Parser

### Frontend
- React 18
- React Router DOM
- Axios
- Modern CSS with Gradient UI

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd hospital-database-app
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Database Setup

1. Start your MySQL server
2. Run the database schema:
```bash
mysql -u root -p < database/schema.sql
```

Or manually create the database by running the SQL commands in `database/schema.sql`

### 5. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=HospitalDB
DB_PORT=3306
PORT=5000
```

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:3000`

### Option 2: Install All Dependencies at Once
```bash
npm run install-all
```

## 📱 Application Structure

```
hospital-database-app/
├── server/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── routes/
│   │   ├── patients.js          # Patient API routes
│   │   ├── doctors.js           # Doctor API routes
│   │   ├── departments.js       # Department API routes
│   │   ├── rooms.js             # Room API routes
│   │   ├── appointments.js      # Appointment API routes
│   │   ├── admissions.js        # Admission API routes
│   │   ├── bills.js             # Bill API routes
│   │   └── views.js             # Database views API
│   └── index.js                 # Express server
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js          # Home page
│   │   │   ├── Patients.js      # Patient management
│   │   │   ├── Doctors.js       # Doctor management
│   │   │   ├── Departments.js   # Department management
│   │   │   ├── Rooms.js         # Room management
│   │   │   ├── Appointments.js  # Appointment management
│   │   │   ├── Admissions.js    # Admission management
│   │   │   ├── Bills.js         # Bill management
│   │   │   └── Views.js         # Database views
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Styling
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   └── package.json
├── database/
│   └── schema.sql               # Database schema and seed data
├── package.json
├── .env.example
└── README.md
```

## 🗄️ Database Schema

The application uses the following tables:
- **Patient**: Patient information
- **Doctor**: Doctor details with department references
- **Department**: Hospital departments
- **Room**: Room types and availability
- **Appointment**: Patient-doctor appointments
- **Admission**: Patient admissions to rooms
- **Bill**: Billing information

### Database Features:
- **Foreign Key Constraints**: Maintain referential integrity
- **Triggers**: Automatically update room availability on admission/discharge
- **Views**: Pre-defined views for complex queries
- **Stored Procedures**: AddDoctor and AddPatient procedures
- **Indexes**: Optimized queries on doctor and patient names

## 🎨 UI Features

- Modern gradient design
- Responsive layout
- Dropdown menus for foreign key relationships
- Real-time data updates
- Success/error message notifications
- Smooth animations and transitions
- Clean and intuitive interface

## 🔌 API Endpoints

### Patients
- GET `/api/patients` - Get all patients
- POST `/api/patients` - Add new patient
- DELETE `/api/patients/:id` - Delete patient

### Doctors
- GET `/api/doctors` - Get all doctors
- POST `/api/doctors` - Add new doctor
- DELETE `/api/doctors/:id` - Delete doctor

### Departments
- GET `/api/departments` - Get all departments
- POST `/api/departments` - Add new department
- DELETE `/api/departments/:id` - Delete department

### Rooms
- GET `/api/rooms` - Get all rooms
- POST `/api/rooms` - Add new room
- DELETE `/api/rooms/:id` - Delete room

### Appointments
- GET `/api/appointments` - Get all appointments
- POST `/api/appointments` - Add new appointment
- DELETE `/api/appointments/:id` - Delete appointment

### Admissions
- GET `/api/admissions` - Get all admissions
- POST `/api/admissions` - Add new admission
- DELETE `/api/admissions/:id` - Delete admission

### Bills
- GET `/api/bills` - Get all bills
- POST `/api/bills` - Add new bill
- DELETE `/api/bills/:id` - Delete bill

### Views
- GET `/api/views/doctors` - Get doctors view
- GET `/api/views/appointments` - Get appointments view
- GET `/api/views/admissions` - Get admissions view
- GET `/api/views/bills` - Get bills view

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Hospital Database Management System

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify credentials in `.env` file
- Check if database exists

### Port Already in Use
- Change the PORT in `.env` file
- Kill the process using the port

### Frontend Not Loading
- Clear browser cache
- Check if backend is running
- Verify proxy settings in `client/package.json`

## 📞 Support

For support, please open an issue in the repository.
