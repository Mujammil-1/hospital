import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { departmentsAPI } from '../services/api';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    DepartmentID: '',
    DepartmentName: '',
    Location: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentsAPI.getAll();
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await departmentsAPI.update(editingDepartment.DepartmentID, formData);
      } else {
        await departmentsAPI.create(formData);
      }
      setShowModal(false);
      setEditingDepartment(null);
      setFormData({
        DepartmentID: '',
        DepartmentName: '',
        Location: ''
      });
      fetchDepartments();
    } catch (err) {
      setError('Failed to save department');
      console.error(err);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      DepartmentID: department.DepartmentID,
      DepartmentName: department.DepartmentName,
      Location: department.Location
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentsAPI.delete(id);
        fetchDepartments();
      } catch (err) {
        setError('Failed to delete department');
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

  if (loading) return <div className="loading">Loading departments...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Departments</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Department
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(department => (
                <tr key={department.DepartmentID}>
                  <td>{department.DepartmentID}</td>
                  <td>{department.DepartmentName}</td>
                  <td>{department.Location}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(department)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(department.DepartmentID)}
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
              <h3>{editingDepartment ? 'Edit Department' : 'Add New Department'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingDepartment(null);
                  setFormData({
                    DepartmentID: '',
                    DepartmentName: '',
                    Location: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department ID *</label>
                <input
                  type="number"
                  name="DepartmentID"
                  value={formData.DepartmentID}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingDepartment}
                />
              </div>
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  name="DepartmentName"
                  value={formData.DepartmentName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="Location"
                  value={formData.Location}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDepartment(null);
                    setFormData({
                      DepartmentID: '',
                      DepartmentName: '',
                      Location: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingDepartment ? 'Update' : 'Add'} Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;