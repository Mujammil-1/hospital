import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { billsAPI, patientsAPI, admissionsAPI } from '../services/api';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    PatientID: '',
    AdmissionID: '',
    Amount: '',
    PaymentStatus: 'Pending'
  });

  useEffect(() => {
    fetchBills();
    fetchPatients();
    fetchAdmissions();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getAll();
      setBills(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bills');
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

  const fetchAdmissions = async () => {
    try {
      const response = await admissionsAPI.getAll();
      setAdmissions(response.data);
    } catch (err) {
      console.error('Failed to fetch admissions:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBill) {
        await billsAPI.update(editingBill.BillID, formData);
      } else {
        await billsAPI.create(formData);
      }
      setShowModal(false);
      setEditingBill(null);
      setFormData({
        PatientID: '',
        AdmissionID: '',
        Amount: '',
        PaymentStatus: 'Pending'
      });
      fetchBills();
    } catch (err) {
      setError('Failed to save bill');
      console.error(err);
    }
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      PatientID: bill.PatientID,
      AdmissionID: bill.AdmissionID,
      Amount: bill.Amount,
      PaymentStatus: bill.PaymentStatus
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billsAPI.delete(id);
        fetchBills();
      } catch (err) {
        setError('Failed to delete bill');
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

  const getAdmissionInfo = (admissionId) => {
    const admission = admissions.find(a => a.AdmissionID === admissionId);
    return admission ? `Admission #${admission.AdmissionID}` : 'Unknown';
  };

  if (loading) return <div className="loading">Loading bills...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Bills</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Bill
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Admission</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.BillID}>
                  <td>{bill.BillID}</td>
                  <td>{getPatientName(bill.PatientID)}</td>
                  <td>{getAdmissionInfo(bill.AdmissionID)}</td>
                  <td>₹{bill.Amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${bill.PaymentStatus.toLowerCase()}`}>
                      {bill.PaymentStatus}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(bill)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(bill.BillID)}
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
              <h3>{editingBill ? 'Edit Bill' : 'Add New Bill'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingBill(null);
                  setFormData({
                    PatientID: '',
                    AdmissionID: '',
                    Amount: '',
                    PaymentStatus: 'Pending'
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
                  <label>Admission *</label>
                  <select
                    name="AdmissionID"
                    value={formData.AdmissionID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Admission</option>
                    {admissions.map(admission => (
                      <option key={admission.AdmissionID} value={admission.AdmissionID}>
                        Admission #{admission.AdmissionID} - {getPatientName(admission.PatientID)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    name="Amount"
                    value={formData.Amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    name="PaymentStatus"
                    value={formData.PaymentStatus}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBill(null);
                    setFormData({
                      PatientID: '',
                      AdmissionID: '',
                      Amount: '',
                      PaymentStatus: 'Pending'
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingBill ? 'Update' : 'Add'} Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsPage;