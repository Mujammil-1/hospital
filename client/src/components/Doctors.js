import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    Specialization: '',
    ContactNo: '',
    DepartmentID: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/doctors', formData);
      setMessage({ text: 'Doctor added successfully!', type: 'success' });
      setFormData({ Name: '', Specialization: '', ContactNo: '', DepartmentID: '' });
      fetchDoctors();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding doctor: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`/api/doctors/${id}`);
        setMessage({ text: 'Doctor deleted successfully!', type: 'success' });
        fetchDoctors();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting doctor: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">👨‍⚕️ Doctor Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Doctor</h3>
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
              <label>Specialization</label>
              <input
                type="text"
                name="Specialization"
                value={formData.Specialization}
                onChange={handleChange}
                maxLength="50"
              />
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
              <label>Department *</label>
              <select 
                name="DepartmentID" 
                value={formData.DepartmentID} 
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Doctor</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Doctors</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Contact</th>
              <th>Department ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.DoctorID}>
                <td>{doctor.DoctorID}</td>
                <td>{doctor.Name}</td>
                <td>{doctor.Specialization}</td>
                <td>{doctor.ContactNo}</td>
                <td>{doctor.DepartmentID}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(doctor.DoctorID)}
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

export default Doctors;
