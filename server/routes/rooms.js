const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Room');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get room by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Room WHERE RoomID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new room
router.post('/', async (req, res) => {
    try {
        const { RoomType, Availability } = req.body;
        const [result] = await db.query(
            'INSERT INTO Room (RoomType, Availability) VALUES (?, ?)',
            [RoomType, Availability]
        );
        res.status(201).json({ message: 'Room added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update room
router.put('/:id', async (req, res) => {
    try {
        const { RoomType, Availability } = req.body;
        const [result] = await db.query(
            'UPDATE Room SET RoomType = ?, Availability = ? WHERE RoomID = ?',
            [RoomType, Availability, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete room
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Room WHERE RoomID = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
