const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all departments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Department');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get department by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Department WHERE DepartmentID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new department
router.post('/', async (req, res) => {
    try {
        const { DepartmentID, DepartmentName, Location } = req.body;
        const [result] = await db.query(
            'INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES (?, ?, ?)',
            [DepartmentID, DepartmentName, Location]
        );
        res.status(201).json({ message: 'Department added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update department
router.put('/:id', async (req, res) => {
    try {
        const { DepartmentName, Location } = req.body;
        const [result] = await db.query(
            'UPDATE Department SET DepartmentName = ?, Location = ? WHERE DepartmentID = ?',
            [DepartmentName, Location, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete department
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Department WHERE DepartmentID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
