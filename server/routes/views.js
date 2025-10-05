const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get doctors view
router.get('/doctors', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vw_Doctors');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments view
router.get('/appointments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vw_Appointments');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get admissions view
router.get('/admissions', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vw_Admissions');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bills view
router.get('/bills', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vw_Bills');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
