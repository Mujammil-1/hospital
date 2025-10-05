const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all admissions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Admission ORDER BY AdmissionID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admission by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Admission WHERE AdmissionID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new admission
router.post('/', async (req, res) => {
  try {
    const { PatientID, RoomID, AdmissionDate, DischargeDate } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Admission (PatientID, RoomID, AdmissionDate, DischargeDate) VALUES (?, ?, ?, ?)',
      [PatientID, RoomID, AdmissionDate, DischargeDate]
    );
    res.status(201).json({ id: result.insertId, message: 'Admission created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admission
router.put('/:id', async (req, res) => {
  try {
    const { PatientID, RoomID, AdmissionDate, DischargeDate } = req.body;
    const [result] = await db.execute(
      'UPDATE Admission SET PatientID = ?, RoomID = ?, AdmissionDate = ?, DischargeDate = ? WHERE AdmissionID = ?',
      [PatientID, RoomID, AdmissionDate, DischargeDate, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json({ message: 'Admission updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete admission
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Admission WHERE AdmissionID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json({ message: 'Admission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;