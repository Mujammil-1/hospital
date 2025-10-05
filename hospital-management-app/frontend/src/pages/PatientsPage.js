import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { patientsAPI } from '../services/api';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Age: '',
    Gender: '',
    ContactNo: '',
    Address: '',
    Disease: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsAPI.getAll();
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await patientsAPI.update(editingPatient.PatientID, formData);
      } else {
        await patientsAPI.create(formData);
      }
      setShowModal(false);
      setEditingPatient(null);
      setFormData({
        Name: '',
        Age: '',
        Gender: '',
        ContactNo: '',
        Address: '',
        Disease: ''
      });
      fetchPatients();
    } catch (err) {
      setError('Failed to save patient');
      console.error(err);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      Name: patient.Name,
      Age: patient.Age,
      Gender: patient.Gender,
      ContactNo: patient.ContactNo,
      Address: patient.Address,
      Disease: patient.Disease
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientsAPI.delete(id);
        fetchPatients();
      } catch (err) {
        setError('Failed to delete patient');
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

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Patients</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Patient
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Disease</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
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
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(patient)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(patient.PatientID)}
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
              <h3>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingPatient(null);
                  setFormData({
                    Name: '',
                    Age: '',
                    Gender: '',
                    ContactNo: '',
                    Address: '',
                    Disease: ''
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
                  <label>Age</label>
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact No</label>
                  <input
                    type="text"
                    name="ContactNo"
                    value={formData.ContactNo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Disease</label>
                <input
                  type="text"
                  name="Disease"
                  value={formData.Disease}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPatient(null);
                    setFormData({
                      Name: '',
                      Age: '',
                      Gender: '',
                      ContactNo: '',
                      Address: '',
                      Disease: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingPatient ? 'Update' : 'Add'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;