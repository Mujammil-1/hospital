const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Appointment ORDER BY AppointmentID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Appointment WHERE AppointmentID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?, ?, ?, ?)',
      [PatientID, DoctorID, AppointmentDate, Status]
    );
    res.status(201).json({ id: result.insertId, message: 'Appointment created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
    const [result] = await db.execute(
      'UPDATE Appointment SET PatientID = ?, DoctorID = ?, AppointmentDate = ?, Status = ? WHERE AppointmentID = ?',
      [PatientID, DoctorID, AppointmentDate, Status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Appointment WHERE AppointmentID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;