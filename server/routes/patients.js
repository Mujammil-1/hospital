const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Patient');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Patient WHERE PatientID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new patient
router.post('/', async (req, res) => {
    try {
        const { Name, Age, Gender, ContactNo, Address, Disease } = req.body;
        const [result] = await db.query(
            'INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease) VALUES (?, ?, ?, ?, ?, ?)',
            [Name, Age, Gender, ContactNo, Address, Disease]
        );
        res.status(201).json({ message: 'Patient added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update patient
router.put('/:id', async (req, res) => {
    try {
        const { Name, Age, Gender, ContactNo, Address, Disease } = req.body;
        const [result] = await db.query(
            'UPDATE Patient SET Name = ?, Age = ?, Gender = ?, ContactNo = ?, Address = ?, Disease = ? WHERE PatientID = ?',
            [Name, Age, Gender, ContactNo, Address, Disease, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete patient
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Patient WHERE PatientID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
