import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    Age: '',
    Gender: '',
    ContactNo: '',
    Address: '',
    Disease: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/patients', formData);
      setMessage({ text: 'Patient added successfully!', type: 'success' });
      setFormData({ Name: '', Age: '', Gender: '', ContactNo: '', Address: '', Disease: '' });
      fetchPatients();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding patient: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`/api/patients/${id}`);
        setMessage({ text: 'Patient deleted successfully!', type: 'success' });
        fetchPatients();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting patient: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">👥 Patient Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Patient</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
                maxLength="30"
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="Gender" value={formData.Gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="ContactNo"
                value={formData.ContactNo}
                onChange={handleChange}
                maxLength="15"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <label>Disease</label>
              <input
                type="text"
                name="Disease"
                value={formData.Disease}
                onChange={handleChange}
                maxLength="50"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Patient</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Patients</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Disease</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.PatientID}>
                <td>{patient.PatientID}</td>
                <td>{patient.Name}</td>
                <td>{patient.Age}</td>
                <td>{patient.Gender}</td>
                <td>{patient.ContactNo}</td>
                <td>{patient.Address}</td>
                <td>{patient.Disease}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(patient.PatientID)}
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

export default Patients;
