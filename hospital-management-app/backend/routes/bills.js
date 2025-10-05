const express = require('express');
const db = require('../database');
const router = express.Router();

// Get all bills
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Bill ORDER BY BillID');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bill by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Bill WHERE BillID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new bill
router.post('/', async (req, res) => {
  try {
    const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
    const [result] = await db.execute(
      'INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?, ?, ?, ?)',
      [PatientID, AdmissionID, Amount, PaymentStatus]
    );
    res.status(201).json({ id: result.insertId, message: 'Bill created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update bill
router.put('/:id', async (req, res) => {
  try {
    const { PatientID, AdmissionID, Amount, PaymentStatus } = req.body;
    const [result] = await db.execute(
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
    const [result] = await db.execute('DELETE FROM Bill WHERE BillID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;