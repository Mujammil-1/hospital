# Hospital Management System

A full-stack web application for managing hospital operations including patients, doctors, departments, rooms, appointments, admissions, and billing.

## Features

- **Patient Management**: Add, edit, delete, and view patient information
- **Doctor Management**: Manage doctor profiles with specializations and department assignments
- **Department Management**: Organize hospital departments with locations
- **Room Management**: Track room availability and types
- **Appointment Scheduling**: Schedule and manage patient appointments
- **Admission Management**: Handle patient admissions and discharges
- **Billing System**: Generate and track patient bills
- **Database Views**: Pre-built views for comprehensive data analysis
- **Modern UI**: Responsive design with intuitive navigation

## Technology Stack

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- Body-parser
- Dotenv

### Frontend
- React 18
- React Router DOM
- Axios
- Lucide React (Icons)
- CSS3

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd hospital-management-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Database Setup
1. Make sure MySQL is running on your system
2. Update the database configuration in `backend/.env`:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=HospitalDB
PORT=5000
```

3. Initialize the database:
```bash
node init-database.js
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
# or for development with auto-restart
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Database Schema

The application uses the following main tables:

- **Patient**: Patient information and medical details
- **Doctor**: Doctor profiles with specializations
- **Department**: Hospital departments and locations
- **Room**: Room types and availability
- **Appointment**: Patient appointments with doctors
- **Admission**: Patient admissions and room assignments
- **Bill**: Patient billing and payment tracking

### Database Views

- **vw_Doctors**: Complete doctor information with department details
- **vw_Appointments**: Appointment details with patient and doctor names
- **vw_Admissions**: Admission details with patient and room information
- **vw_Bills**: Bill information with patient details

### Stored Procedures

- **AddDoctor**: Add new doctor records
- **AddPatient**: Add new patient records

### Triggers

- **after_admission_insert**: Automatically mark rooms as unavailable when patients are admitted
- **after_admission_update**: Automatically mark rooms as available when patients are discharged

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Admissions
- `GET /api/admissions` - Get all admissions
- `GET /api/admissions/:id` - Get admission by ID
- `POST /api/admissions` - Create new admission
- `PUT /api/admissions/:id` - Update admission
- `DELETE /api/admissions/:id` - Delete admission

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill by ID
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

### Views
- `GET /api/views/doctors` - Get doctors view
- `GET /api/views/appointments` - Get appointments view
- `GET /api/views/admissions` - Get admissions view
- `GET /api/views/bills` - Get bills view

## Usage

1. **Navigation**: Use the top navigation bar to switch between different sections
2. **Adding Records**: Click the "Add" button in any section to create new records
3. **Editing Records**: Click the edit button (pencil icon) next to any record
4. **Deleting Records**: Click the delete button (trash icon) next to any record
5. **Views**: Use the Views section to see comprehensive data from database views

## Features in Detail

### Dropdown Menus
- Patient selection in appointments and admissions
- Doctor selection in appointments
- Department selection when adding doctors
- Room selection in admissions
- Status selection for appointments and bills

### Data Validation
- Required field validation
- Data type validation
- Foreign key constraints
- Unique constraints

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly buttons
- Optimized for various screen sizes

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill existing processes using the port

3. **CORS Issues**
   - Ensure backend is running on port 5000
   - Check CORS configuration in server.js

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.