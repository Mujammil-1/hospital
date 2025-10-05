import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bills() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [formData, setFormData] = useState({
    PatientID: '',
    AdmissionID: '',
    Amount: '',
    PaymentStatus: 'Pending'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchBills();
    fetchPatients();
    fetchAdmissions();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/bills');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
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

  const fetchAdmissions = async () => {
    try {
      const response = await axios.get('/api/admissions');
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/bills', formData);
      setMessage({ text: 'Bill added successfully!', type: 'success' });
      setFormData({ PatientID: '', AdmissionID: '', Amount: '', PaymentStatus: 'Pending' });
      fetchBills();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding bill: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await axios.delete(`/api/bills/${id}`);
        setMessage({ text: 'Bill deleted successfully!', type: 'success' });
        fetchBills();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting bill: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">💰 Bill Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Bill</h3>
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
              <label>Admission *</label>
              <select 
                name="AdmissionID" 
                value={formData.AdmissionID} 
                onChange={handleChange}
                required
              >
                <option value="">Select Admission</option>
                {admissions.map((admission) => (
                  <option key={admission.AdmissionID} value={admission.AdmissionID}>
                    Admission #{admission.AdmissionID} - Patient {admission.PatientID}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="Amount"
                value={formData.Amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Status *</label>
              <select 
                name="PaymentStatus" 
                value={formData.PaymentStatus} 
                onChange={handleChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Bill</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Bills</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Patient ID</th>
              <th>Admission ID</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.BillID}>
                <td>{bill.BillID}</td>
                <td>{bill.PatientID}</td>
                <td>{bill.AdmissionID}</td>
                <td>₹{bill.Amount}</td>
                <td>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '5px',
                    background: bill.PaymentStatus === 'Paid' ? '#d4edda' : '#fff3cd',
                    color: bill.PaymentStatus === 'Paid' ? '#155724' : '#856404'
                  }}>
                    {bill.PaymentStatus}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(bill.BillID)}
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

export default Bills;
