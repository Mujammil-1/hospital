import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { doctorsAPI, departmentsAPI } from '../services/api';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Specialization: '',
    ContactNo: '',
    DepartmentID: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll();
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await doctorsAPI.update(editingDoctor.DoctorID, formData);
      } else {
        await doctorsAPI.create(formData);
      }
      setShowModal(false);
      setEditingDoctor(null);
      setFormData({
        Name: '',
        Specialization: '',
        ContactNo: '',
        DepartmentID: ''
      });
      fetchDoctors();
    } catch (err) {
      setError('Failed to save doctor');
      console.error(err);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      Name: doctor.Name,
      Specialization: doctor.Specialization,
      ContactNo: doctor.ContactNo,
      DepartmentID: doctor.DepartmentID
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorsAPI.delete(id);
        fetchDoctors();
      } catch (err) {
        setError('Failed to delete doctor');
        console.error(err);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.DepartmentID === departmentId);
    return dept ? dept.DepartmentName : 'Unknown';
  };

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Doctors</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Doctor
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.DoctorID}>
                  <td>{doctor.DoctorID}</td>
                  <td>{doctor.Name}</td>
                  <td>{doctor.Specialization}</td>
                  <td>{doctor.ContactNo}</td>
                  <td>{getDepartmentName(doctor.DepartmentID)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(doctor)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(doctor.DoctorID)}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingDoctor(null);
                  setFormData({
                    Name: '',
                    Specialization: '',
                    ContactNo: '',
                    DepartmentID: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="Specialization"
                    value={formData.Specialization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Contact No</label>
                  <input
                    type="text"
                    name="ContactNo"
                    value={formData.ContactNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="DepartmentID"
                    value={formData.DepartmentID}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.DepartmentID} value={dept.DepartmentID}>
                        {dept.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDoctor(null);
                    setFormData({
                      Name: '',
                      Specialization: '',
                      ContactNo: '',
                      DepartmentID: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingDoctor ? 'Update' : 'Add'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;