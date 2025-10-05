const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'HospitalDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

// Patient routes
app.get('/api/patients', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Patient ORDER BY PatientID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/patients', async (req, res) => {
    try {
        const { Name, Age, Gender, ContactNo, Address, Disease } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease) VALUES (?, ?, ?, ?, ?, ?)',
            [Name, Age, Gender, ContactNo, Address, Disease]
        );
        res.json({ id: result.insertId, message: 'Patient added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Age, Gender, ContactNo, Address, Disease } = req.body;
        await pool.execute(
            'UPDATE Patient SET Name = ?, Age = ?, Gender = ?, ContactNo = ?, Address = ?, Disease = ? WHERE PatientID = ?',
            [Name, Age, Gender, ContactNo, Address, Disease, id]
        );
        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM Patient WHERE PatientID = ?', [id]);
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Department routes
app.get('/api/departments', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Department ORDER BY DepartmentID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/departments', async (req, res) => {
    try {
        const { DepartmentID, DepartmentName, Location } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES (?, ?, ?)',
            [DepartmentID, DepartmentName, Location]
        );
        res.json({ message: 'Department added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Doctor routes
app.get('/api/doctors', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Doctor ORDER BY DoctorID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/doctors', async (req, res) => {
    try {
        const { Name, Specialization, ContactNo, DepartmentID } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID) VALUES (?, ?, ?, ?)',
            [Name, Specialization, ContactNo, DepartmentID]
        );
        res.json({ id: result.insertId, message: 'Doctor added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Room routes
app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Room ORDER BY RoomID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/rooms', async (req, res) => {
    try {
        const { RoomType, Availability } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Room (RoomType, Availability) VALUES (?, ?)',
            [RoomType, Availability]
        );
        res.json({ id: result.insertId, message: 'Room added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { RoomType, Availability } = req.body;
        await pool.execute(
            'UPDATE Room SET RoomType = ?, Availability = ? WHERE RoomID = ?',
            [RoomType, Availability, id]
        );
        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Appointment routes
app.get('/api/appointments', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Appointment ORDER BY AppointmentID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?, ?, ?, ?)',
            [PatientID, DoctorID, AppointmentDate, Status]
        );
        res.json({ id: result.insertId, message: 'Appointment scheduled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
        await pool.execute(
            'UPDATE Appointment SET PatientID = ?, DoctorID = ?, AppointmentDate = ?, Status = ? WHERE AppointmentID = ?',
            [PatientID, DoctorID, AppointmentDate, Status, id]
        );
        res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admission routes
app.get('/api/admissions', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Admission ORDER BY AdmissionID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admissions', async (req, res) => {
    try {
        const { PatientID, RoomID, AdmissionDate, DischargeDate } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Admission (PatientID, RoomID, AdmissionDate, DischargeDate) VALUES (?, ?, ?, ?)',
            [PatientID, RoomID, AdmissionDate, DischargeDate || null]
        );
        res.json({ id: result.insertId, message: 'Admission recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admissions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { PatientID, RoomID, AdmissionDate, DischargeDate } = req.body;
        await pool.execute(
            'UPDATE Admission SET PatientID = ?, RoomID = ?, AdmissionDate = ?, DischargeDate = ? WHERE AdmissionID = ?',
            [PatientID, RoomID, AdmissionDate, DischargeDate || null, id]
        );
        res.json({ message: 'Admission updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bill routes
app.get('/api/bills', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Bill ORDER BY BillID');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bills', async (req, res) => {
    try {
        const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?, ?, ?, ?)',
            [PatientID, AdmissionID, Amount, PaymentStatus]
        );
        res.json({ id: result.insertId, message: 'Bill created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/bills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
        await pool.execute(
            'UPDATE Bill SET PatientID = ?, AdmissionID = ?, Amount = ?, PaymentStatus = ? WHERE BillID = ?',
            [PatientID, AdmissionID, Amount, PaymentStatus, id]
        );
        res.json({ message: 'Bill updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View routes
app.get('/api/views/doctors', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vw_Doctors');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/views/appointments', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vw_Appointments');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/views/admissions', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vw_Admissions');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/views/bills', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vw_Bills');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Hospital Database API is running' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await testConnection();
});

module.exports = app;