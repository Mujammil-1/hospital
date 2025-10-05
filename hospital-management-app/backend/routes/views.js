const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all doctors view
router.get('/doctors', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM vw_Doctors ORDER BY DoctorID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all appointments view
router.get('/appointments', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM vw_Appointments ORDER BY AppointmentID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all admissions view
router.get('/admissions', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM vw_Admissions ORDER BY AdmissionID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bills view
router.get('/bills', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM vw_Bills ORDER BY BillID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;