import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { viewsAPI } from '../services/api';

const ViewsPage = () => {
  const [activeView, setActiveView] = useState('doctors');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const views = [
    { key: 'doctors', label: 'Doctors View', description: 'Complete doctor information with department details' },
    { key: 'appointments', label: 'Appointments View', description: 'Appointment details with patient and doctor names' },
    { key: 'admissions', label: 'Admissions View', description: 'Admission details with patient and room information' },
    { key: 'bills', label: 'Bills View', description: 'Bill information with patient details' }
  ];

  useEffect(() => {
    fetchViewData();
  }, [activeView]);

  const fetchViewData = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      switch (activeView) {
        case 'doctors':
          response = await viewsAPI.getDoctors();
          break;
        case 'appointments':
          response = await viewsAPI.getAppointments();
          break;
        case 'admissions':
          response = await viewsAPI.getAdmissions();
          break;
        case 'bills':
          response = await viewsAPI.getBills();
          break;
        default:
          response = await viewsAPI.getDoctors();
      }
      
      setData(response.data);
    } catch (err) {
      setError(`Failed to fetch ${activeView} view data`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) return <div className="loading">Loading {activeView} data...</div>;
    if (error) return <div className="error">{error}</div>;
    if (data.length === 0) return <div className="loading">No data available</div>;

    switch (activeView) {
      case 'doctors':
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Department ID</th>
                <th>Department Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map(doctor => (
                <tr key={doctor.DoctorID}>
                  <td>{doctor.DoctorID}</td>
                  <td>{doctor.DoctorName}</td>
                  <td>{doctor.Specialization}</td>
                  <td>{doctor.ContactNo}</td>
                  <td>{doctor.DepartmentID}</td>
                  <td>{doctor.DepartmentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'appointments':
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map(appointment => (
                <tr key={appointment.AppointmentID}>
                  <td>{appointment.AppointmentID}</td>
                  <td>{new Date(appointment.AppointmentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${appointment.Status.toLowerCase()}`}>
                      {appointment.Status}
                    </span>
                  </td>
                  <td>{appointment.PatientID}</td>
                  <td>{appointment.PatientName}</td>
                  <td>{appointment.DoctorID}</td>
                  <td>{appointment.DoctorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'admissions':
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Admission Date</th>
                <th>Discharge Date</th>
                <th>Room ID</th>
                <th>Room Type</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map(admission => (
                <tr key={admission.AdmissionID}>
                  <td>{admission.AdmissionID}</td>
                  <td>{new Date(admission.AdmissionDate).toLocaleDateString()}</td>
                  <td>{admission.DischargeDate ? new Date(admission.DischargeDate).toLocaleDateString() : 'Not Discharged'}</td>
                  <td>{admission.RoomID}</td>
                  <td>{admission.RoomType}</td>
                  <td>{admission.PatientID}</td>
                  <td>{admission.PatientName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'bills':
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Admission ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map(bill => (
                <tr key={bill.BillID}>
                  <td>{bill.BillID}</td>
                  <td>₹{bill.Amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${bill.PaymentStatus.toLowerCase()}`}>
                      {bill.PaymentStatus}
                    </span>
                  </td>
                  <td>{bill.PatientID}</td>
                  <td>{bill.PatientName}</td>
                  <td>{bill.AdmissionID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return <div>No data to display</div>;
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Database Views</h2>
          <button 
            className="btn" 
            onClick={fetchViewData}
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {views.map(view => (
              <button
                key={view.key}
                className={`btn ${activeView === view.key ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => setActiveView(view.key)}
                style={{ marginBottom: '0.5rem' }}
              >
                <Eye size={20} />
                {view.label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            {views.find(v => v.key === activeView)?.description}
          </p>
        </div>

        <div className="table-container">
          {renderTable()}
        </div>
      </div>

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ViewsPage;