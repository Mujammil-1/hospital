import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { admissionsAPI, patientsAPI, roomsAPI } from '../services/api';

const AdmissionsPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [formData, setFormData] = useState({
    PatientID: '',
    RoomID: '',
    AdmissionDate: '',
    DischargeDate: ''
  });

  useEffect(() => {
    fetchAdmissions();
    fetchPatients();
    fetchRooms();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await admissionsAPI.getAll();
      setAdmissions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch admissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setRooms(response.data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmission) {
        await admissionsAPI.update(editingAdmission.AdmissionID, formData);
      } else {
        await admissionsAPI.create(formData);
      }
      setShowModal(false);
      setEditingAdmission(null);
      setFormData({
        PatientID: '',
        RoomID: '',
        AdmissionDate: '',
        DischargeDate: ''
      });
      fetchAdmissions();
    } catch (err) {
      setError('Failed to save admission');
      console.error(err);
    }
  };

  const handleEdit = (admission) => {
    setEditingAdmission(admission);
    setFormData({
      PatientID: admission.PatientID,
      RoomID: admission.RoomID,
      AdmissionDate: admission.AdmissionDate,
      DischargeDate: admission.DischargeDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        await admissionsAPI.delete(id);
        fetchAdmissions();
      } catch (err) {
        setError('Failed to delete admission');
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

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.PatientID === patientId);
    return patient ? patient.Name : 'Unknown';
  };

  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.RoomID === roomId);
    return room ? `${room.RoomType} (${room.RoomID})` : 'Unknown';
  };

  if (loading) return <div className="loading">Loading admissions...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Admissions</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Admission
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Room</th>
                <th>Admission Date</th>
                <th>Discharge Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map(admission => (
                <tr key={admission.AdmissionID}>
                  <td>{admission.AdmissionID}</td>
                  <td>{getPatientName(admission.PatientID)}</td>
                  <td>{getRoomInfo(admission.RoomID)}</td>
                  <td>{new Date(admission.AdmissionDate).toLocaleDateString()}</td>
                  <td>{admission.DischargeDate ? new Date(admission.DischargeDate).toLocaleDateString() : 'Not Discharged'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(admission)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(admission.AdmissionID)}
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
              <h3>{editingAdmission ? 'Edit Admission' : 'Add New Admission'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingAdmission(null);
                  setFormData({
                    PatientID: '',
                    RoomID: '',
                    AdmissionDate: '',
                    DischargeDate: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Patient *</label>
                  <select
                    name="PatientID"
                    value={formData.PatientID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
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
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.RoomID} value={room.RoomID}>
                        {room.RoomType} (ID: {room.RoomID}) - {room.Availability}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Admission Date *</label>
                  <input
                    type="date"
                    name="AdmissionDate"
                    value={formData.AdmissionDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discharge Date</label>
                  <input
                    type="date"
                    name="DischargeDate"
                    value={formData.DischargeDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAdmission(null);
                    setFormData({
                      PatientID: '',
                      RoomID: '',
                      AdmissionDate: '',
                      DischargeDate: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingAdmission ? 'Update' : 'Add'} Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsPage;