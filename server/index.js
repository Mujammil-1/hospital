const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const departmentRoutes = require('./routes/departments');
const roomRoutes = require('./routes/rooms');
const appointmentRoutes = require('./routes/appointments');
const admissionRoutes = require('./routes/admissions');
const billRoutes = require('./routes/bills');
const viewRoutes = require('./routes/views');

app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/views', viewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Hospital Database API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
