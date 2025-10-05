const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/views', require('./routes/views'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Hospital Management API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});