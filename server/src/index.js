import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { pool, query } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || '*';

app.use(cors({ origin: clientOrigin, credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: result[0]?.ok === 1 });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Generic list endpoints
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await query('SELECT * FROM Patient ORDER BY PatientID DESC');
    res.json(patients);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { Name, Age, Gender, ContactNo, Address, Disease } = req.body;
    const sql = `INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease)
                 VALUES (:Name, :Age, :Gender, :ContactNo, :Address, :Disease)`;
    const result = await query(sql, { Name, Age, Gender, ContactNo, Address, Disease });
    res.status(201).json({ PatientID: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/departments', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Department ORDER BY DepartmentName');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Doctor ORDER BY DoctorID DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const { Name, Specialization, ContactNo, DepartmentID } = req.body;
    const sql = `INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID)
                 VALUES (:Name, :Specialization, :ContactNo, :DepartmentID)`;
    const result = await query(sql, { Name, Specialization, ContactNo, DepartmentID });
    res.status(201).json({ DoctorID: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const { availableOnly } = req.query;
    let sql = 'SELECT * FROM Room';
    if (availableOnly === 'true') {
      sql += " WHERE Availability = 'Yes'";
    }
    sql += ' ORDER BY RoomID DESC';
    const rows = await query(sql);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Appointment ORDER BY AppointmentID DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
    const sql = `INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status)
                 VALUES (:PatientID, :DoctorID, :AppointmentDate, :Status)`;
    const result = await query(sql, { PatientID, DoctorID, AppointmentDate, Status });
    res.status(201).json({ AppointmentID: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admissions', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Admission ORDER BY AdmissionID DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const { PatientID, RoomID, AdmissionDate, DischargeDate } = req.body;
    const sql = `INSERT INTO Admission (PatientID, RoomID, AdmissionDate, DischargeDate)
                 VALUES (:PatientID, :RoomID, :AdmissionDate, :DischargeDate)`;
    const result = await query(sql, { PatientID, RoomID, AdmissionDate, DischargeDate });
    res.status(201).json({ AdmissionID: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/bills', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Bill ORDER BY BillID DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/bills', async (req, res) => {
  try {
    const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
    const sql = `INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus)
                 VALUES (:PatientID, :AdmissionID, :Amount, :PaymentStatus)`;
    const result = await query(sql, { PatientID, AdmissionID, Amount, PaymentStatus });
    res.status(201).json({ BillID: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Views
const allowedViews = new Set(['vw_Doctors','vw_Appointments','vw_Admissions','vw_Bills']);
app.get('/api/views/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (!allowedViews.has(name)) {
      return res.status(400).json({ error: 'Unknown view' });
    }
    const rows = await query(`SELECT * FROM ${name}`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Tables (whitelisted to prevent SQL injection)
const allowedTables = new Set(['Patient','Department','Doctor','Room','Appointment','Admission','Bill']);
app.get('/api/tables/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (!allowedTables.has(name)) {
      return res.status(400).json({ error: 'Unknown table' });
    }
    const rows = await query(`SELECT * FROM ${name}`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on :${port}`);
});
