const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Appointment');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Appointment WHERE AppointmentID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new appointment
router.post('/', async (req, res) => {
    try {
        const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
        const [result] = await db.query(
            'INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?, ?, ?, ?)',
            [PatientID, DoctorID, AppointmentDate, Status]
        );
        res.status(201).json({ message: 'Appointment added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update appointment
router.put('/:id', async (req, res) => {
    try {
        const { PatientID, DoctorID, AppointmentDate, Status } = req.body;
        const [result] = await db.query(
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
        const [result] = await db.query('DELETE FROM Appointment WHERE AppointmentID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
