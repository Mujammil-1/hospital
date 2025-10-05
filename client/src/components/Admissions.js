import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    PatientID: '',
    RoomID: '',
    AdmissionDate: '',
    DischargeDate: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAdmissions();
    fetchPatients();
    fetchRooms();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await axios.get('/api/admissions');
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
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

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admissions', formData);
      setMessage({ text: 'Admission added successfully!', type: 'success' });
      setFormData({ PatientID: '', RoomID: '', AdmissionDate: '', DischargeDate: '' });
      fetchAdmissions();
      fetchRooms(); // Refresh rooms to see updated availability
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding admission: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        await axios.delete(`/api/admissions/${id}`);
        setMessage({ text: 'Admission deleted successfully!', type: 'success' });
        fetchAdmissions();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting admission: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🏥 Admission Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Admission</h3>
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
              <label>Room *</label>
              <select 
                name="RoomID" 
                value={formData.RoomID} 
                onChange={handleChange}
                required
              >
                <option value="">Select Room</option>
                {rooms.map((room) => (
                  <option key={room.RoomID} value={room.RoomID}>
                    Room {room.RoomID} - {room.RoomType} ({room.Availability === 'Yes' ? 'Available' : 'Occupied'})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Admission Date *</label>
              <input
                type="date"
                name="AdmissionDate"
                value={formData.AdmissionDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Discharge Date</label>
              <input
                type="date"
                name="DischargeDate"
                value={formData.DischargeDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Admission</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Admissions</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Room ID</th>
              <th>Admission Date</th>
              <th>Discharge Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission.AdmissionID}>
                <td>{admission.AdmissionID}</td>
                <td>{admission.PatientID}</td>
                <td>{admission.RoomID}</td>
                <td>{new Date(admission.AdmissionDate).toLocaleDateString()}</td>
                <td>{admission.DischargeDate ? new Date(admission.DischargeDate).toLocaleDateString() : 'Not Discharged'}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(admission.AdmissionID)}
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

export default Admissions;
