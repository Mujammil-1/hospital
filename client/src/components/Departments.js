import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    DepartmentID: '',
    DepartmentName: '',
    Location: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

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
      await axios.post('/api/departments', formData);
      setMessage({ text: 'Department added successfully!', type: 'success' });
      setFormData({ DepartmentID: '', DepartmentName: '', Location: '' });
      fetchDepartments();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding department: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`/api/departments/${id}`);
        setMessage({ text: 'Department deleted successfully!', type: 'success' });
        fetchDepartments();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting department: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🏢 Department Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Department</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Department ID *</label>
              <input
                type="number"
                name="DepartmentID"
                value={formData.DepartmentID}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Department Name *</label>
              <input
                type="text"
                name="DepartmentName"
                value={formData.DepartmentName}
                onChange={handleChange}
                required
                maxLength="50"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                maxLength="100"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Department</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Departments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.DepartmentID}>
                <td>{dept.DepartmentID}</td>
                <td>{dept.DepartmentName}</td>
                <td>{dept.Location}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(dept.DepartmentID)}
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

export default Departments;
