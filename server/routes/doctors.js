const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Doctor');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Doctor WHERE DoctorID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new doctor
router.post('/', async (req, res) => {
    try {
        const { Name, Specialization, ContactNo, DepartmentID } = req.body;
        const [result] = await db.query(
            'INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID) VALUES (?, ?, ?, ?)',
            [Name, Specialization, ContactNo, DepartmentID]
        );
        res.status(201).json({ message: 'Doctor added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update doctor
router.put('/:id', async (req, res) => {
    try {
        const { Name, Specialization, ContactNo, DepartmentID } = req.body;
        const [result] = await db.query(
            'UPDATE Doctor SET Name = ?, Specialization = ?, ContactNo = ?, DepartmentID = ? WHERE DoctorID = ?',
            [Name, Specialization, ContactNo, DepartmentID, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Doctor WHERE DoctorID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
