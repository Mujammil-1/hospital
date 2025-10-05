import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../services/api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    PatientID: '',
    DoctorID: '',
    AppointmentDate: '',
    Status: 'Scheduled'
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
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

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await appointmentsAPI.update(editingAppointment.AppointmentID, formData);
      } else {
        await appointmentsAPI.create(formData);
      }
      setShowModal(false);
      setEditingAppointment(null);
      setFormData({
        PatientID: '',
        DoctorID: '',
        AppointmentDate: '',
        Status: 'Scheduled'
      });
      fetchAppointments();
    } catch (err) {
      setError('Failed to save appointment');
      console.error(err);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      PatientID: appointment.PatientID,
      DoctorID: appointment.DoctorID,
      AppointmentDate: appointment.AppointmentDate,
      Status: appointment.Status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id);
        fetchAppointments();
      } catch (err) {
        setError('Failed to delete appointment');
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

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.DoctorID === doctorId);
    return doctor ? doctor.Name : 'Unknown';
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Appointments</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Appointment
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.AppointmentID}>
                  <td>{appointment.AppointmentID}</td>
                  <td>{getPatientName(appointment.PatientID)}</td>
                  <td>{getDoctorName(appointment.DoctorID)}</td>
                  <td>{new Date(appointment.AppointmentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${appointment.Status.toLowerCase()}`}>
                      {appointment.Status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(appointment.AppointmentID)}
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
              <h3>{editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingAppointment(null);
                  setFormData({
                    PatientID: '',
                    DoctorID: '',
                    AppointmentDate: '',
                    Status: 'Scheduled'
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
                  <label>Doctor *</label>
                  <select
                    name="DoctorID"
                    value={formData.DoctorID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.DoctorID} value={doctor.DoctorID}>
                        {doctor.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input
                    type="date"
                    name="AppointmentDate"
                    value={formData.AppointmentDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAppointment(null);
                    setFormData({
                      PatientID: '',
                      DoctorID: '',
                      AppointmentDate: '',
                      Status: 'Scheduled'
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingAppointment ? 'Update' : 'Add'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;