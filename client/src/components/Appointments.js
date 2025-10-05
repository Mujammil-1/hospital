import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    PatientID: '',
    DoctorID: '',
    AppointmentDate: '',
    Status: 'Scheduled'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', formData);
      setMessage({ text: 'Appointment added successfully!', type: 'success' });
      setFormData({ PatientID: '', DoctorID: '', AppointmentDate: '', Status: 'Scheduled' });
      fetchAppointments();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding appointment: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`/api/appointments/${id}`);
        setMessage({ text: 'Appointment deleted successfully!', type: 'success' });
        fetchAppointments();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting appointment: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">📅 Appointment Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Appointment</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Patient *</label>
              <select 
                name="PatientID" 
                value={formData.PatientID} 
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.PatientID} value={patient.PatientID}>
                    {patient.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Doctor *</label>
              <select 
                name="DoctorID" 
                value={formData.DoctorID} 
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.DoctorID} value={doctor.DoctorID}>
                    {doctor.Name} - {doctor.Specialization}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Appointment Date *</label>
              <input
                type="date"
                name="AppointmentDate"
                value={formData.AppointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select 
                name="Status" 
                value={formData.Status} 
                onChange={handleChange}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Appointment</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Appointments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Appointment Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.AppointmentID}>
                <td>{appointment.AppointmentID}</td>
                <td>{appointment.PatientID}</td>
                <td>{appointment.DoctorID}</td>
                <td>{new Date(appointment.AppointmentDate).toLocaleDateString()}</td>
                <td>{appointment.Status}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(appointment.AppointmentID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
