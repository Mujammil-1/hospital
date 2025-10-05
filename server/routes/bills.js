const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Bill');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bill by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Bill WHERE BillID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new bill
router.post('/', async (req, res) => {
    try {
        const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
        const [result] = await db.query(
            'INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?, ?, ?, ?)',
            [PatientID, AdmissionID, Amount, PaymentStatus]
        );
        res.status(201).json({ message: 'Bill added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update bill
router.put('/:id', async (req, res) => {
    try {
        const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
        const [result] = await db.query(
            'UPDATE Bill SET PatientID = ?, AdmissionID = ?, Amount = ?, PaymentStatus = ? WHERE BillID = ?',
            [PatientID, AdmissionID, Amount, PaymentStatus, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json({ message: 'Bill updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete bill
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Bill WHERE BillID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
