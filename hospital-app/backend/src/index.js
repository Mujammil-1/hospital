const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function query(res, sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function exec(res, sql, params = []) {
  try {
    const [result] = await pool.execute(sql, params);
    return res.json({ insertedId: result.insertId, affectedRows: result.affectedRows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Tables: list endpoints
app.get('/api/patients', (req, res) => query(res, 'SELECT * FROM Patient ORDER BY PatientID'));
app.get('/api/departments', (req, res) => query(res, 'SELECT * FROM Department ORDER BY DepartmentID'));
app.get('/api/doctors', (req, res) => query(res, 'SELECT * FROM Doctor ORDER BY DoctorID'));
app.get('/api/rooms', (req, res) => query(res, 'SELECT * FROM Room ORDER BY RoomID'));
app.get('/api/appointments', (req, res) => query(res, 'SELECT * FROM Appointment ORDER BY AppointmentID'));
app.get('/api/admissions', (req, res) => query(res, 'SELECT * FROM Admission ORDER BY AdmissionID'));
app.get('/api/bills', (req, res) => query(res, 'SELECT * FROM Bill ORDER BY BillID'));

// Views: list endpoints
const viewMap = {
  doctors: 'vw_Doctors',
  appointments: 'vw_Appointments',
  admissions: 'vw_Admissions',
  bills: 'vw_Bills'
};
app.get('/api/views/:viewName', (req, res) => {
  const view = viewMap[req.params.viewName];
  if (!view) return res.status(404).json({ error: 'View not found' });
  return query(res, `SELECT * FROM ${view}`);
});

// Options for dropdowns
app.get('/api/options/departments', (req, res) => query(res, 'SELECT DepartmentID AS id, DepartmentName AS name FROM Department ORDER BY DepartmentName'));
app.get('/api/options/patients', (req, res) => query(res, 'SELECT PatientID AS id, Name AS name FROM Patient ORDER BY Name'));
app.get('/api/options/doctors', (req, res) => query(res, 'SELECT DoctorID AS id, Name AS name FROM Doctor ORDER BY Name'));
app.get('/api/options/rooms', (req, res) => query(res, "SELECT RoomID AS id, CONCAT('Room ', RoomID, ' - ', RoomType, ' (', Availability, ')') AS name FROM Room ORDER BY RoomID"));
app.get('/api/options/admissions', (req, res) => query(res, "SELECT AdmissionID AS id, CONCAT('Admission ', AdmissionID, ' - Patient ', PatientID) AS name FROM Admission ORDER BY AdmissionID"));

// Create endpoints
app.post('/api/patients', async (req, res) => {
  const { Name, Age, Gender, ContactNo, Address, Disease } = req.body;
  return exec(res, 'INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease) VALUES (?, ?, ?, ?, ?, ?)', [Name, Age, Gender, ContactNo, Address, Disease]);
});

app.post('/api/departments', async (req, res) => {
  const { DepartmentID, DepartmentName, Location } = req.body;
  return exec(res, 'INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES (?, ?, ?)', [DepartmentID, DepartmentName, Location]);
});

app.post('/api/doctors', async (req, res) => {
  const { Name, Specialization, ContactNo, DepartmentID } = req.body;
  return exec(res, 'INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID) VALUES (?, ?, ?, ?)', [Name, Specialization, ContactNo, DepartmentID]);
});

app.post('/api/rooms', async (req, res) => {
  const { RoomType, Availability } = req.body;
  return exec(res, 'INSERT INTO Room (RoomType, Availability) VALUES (?, ?)', [RoomType, Availability]);
});

app.post('/api/appointments', async (req, res) => {
  const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
  return exec(res, 'INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?, ?, ?, ?)', [PatientID, DoctorID, AppointmentDate, Status]);
});

app.post('/api/admissions', async (req, res) => {
  const { PatientID, RoomID, AdmissionDate, DischargeDate } = req.body;
  return exec(res, 'INSERT INTO Admission (PatientID, RoomID, AdmissionDate, DischargeDate) VALUES (?, ?, ?, ?)', [PatientID, RoomID, AdmissionDate, DischargeDate || null]);
});

app.post('/api/bills', async (req, res) => {
  const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
  return exec(res, 'INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?, ?, ?, ?)', [PatientID, AdmissionID, Amount, PaymentStatus]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
