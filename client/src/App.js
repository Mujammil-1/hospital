import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('patients');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states for different entities
  const [patientForm, setPatientForm] = useState({
    Name: '', Age: '', Gender: '', ContactNo: '', Address: '', Disease: ''
  });
  const [doctorForm, setDoctorForm] = useState({
    Name: '', Specialization: '', ContactNo: '', DepartmentID: ''
  });
  const [departmentForm, setDepartmentForm] = useState({
    DepartmentID: '', DepartmentName: '', Location: ''
  });
  const [roomForm, setRoomForm] = useState({
    RoomType: '', Availability: 'Yes'
  });
  const [appointmentForm, setAppointmentForm] = useState({
    PatientID: '', DoctorID: '', AppointmentDate: '', Status: 'Scheduled'
  });
  const [admissionForm, setAdmissionForm] = useState({
    PatientID: '', RoomID: '', AdmissionDate: '', DischargeDate: ''
  });
  const [billForm, setBillForm] = useState({
    PatientID: '', AdmissionID: '', Amount: '', PaymentStatus: 'Pending'
  });

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError('');
    try {
      let endpoint = `${API_BASE_URL}/${tab}`;
      if (tab.startsWith('view-')) {
        endpoint = `${API_BASE_URL}/views/${tab.replace('view-', '')}`;
      }
      const response = await axios.get(endpoint);
      setData(prev => ({ ...prev, [tab]: response.data }));
    } catch (err) {
      setError(`Failed to fetch ${tab}: ${err.message}`);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let formData, endpoint;
      
      switch (activeTab) {
        case 'patients':
          formData = patientForm;
          endpoint = `${API_BASE_URL}/patients`;
          break;
        case 'doctors':
          formData = doctorForm;
          endpoint = `${API_BASE_URL}/doctors`;
          break;
        case 'departments':
          formData = departmentForm;
          endpoint = `${API_BASE_URL}/departments`;
          break;
        case 'rooms':
          formData = roomForm;
          endpoint = `${API_BASE_URL}/rooms`;
          break;
        case 'appointments':
          formData = appointmentForm;
          endpoint = `${API_BASE_URL}/appointments`;
          break;
        case 'admissions':
          formData = admissionForm;
          endpoint = `${API_BASE_URL}/admissions`;
          break;
        case 'bills':
          formData = billForm;
          endpoint = `${API_BASE_URL}/bills`;
          break;
        default:
          return;
      }

      if (editingItem) {
        await axios.put(`${endpoint}/${editingItem.id}`, formData);
      } else {
        await axios.post(endpoint, formData);
      }

      // Reset form and fetch updated data
      resetForm();
      setShowForm(false);
      setEditingItem(null);
      await fetchData(activeTab);
    } catch (err) {
      setError(`Failed to save: ${err.message}`);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setPatientForm({
      Name: '', Age: '', Gender: '', ContactNo: '', Address: '', Disease: ''
    });
    setDoctorForm({
      Name: '', Specialization: '', ContactNo: '', DepartmentID: ''
    });
    setDepartmentForm({
      DepartmentID: '', DepartmentName: '', Location: ''
    });
    setRoomForm({
      RoomType: '', Availability: 'Yes'
    });
    setAppointmentForm({
      PatientID: '', DoctorID: '', AppointmentDate: '', Status: 'Scheduled'
    });
    setAdmissionForm({
      PatientID: '', RoomID: '', AdmissionDate: '', DischargeDate: ''
    });
    setBillForm({
      PatientID: '', AdmissionID: '', Amount: '', PaymentStatus: 'Pending'
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ id: getItemId(item), ...item });
    setShowForm(true);
    
    switch (activeTab) {
      case 'patients':
        setPatientForm(item);
        break;
      case 'doctors':
        setDoctorForm(item);
        break;
      case 'departments':
        setDepartmentForm(item);
        break;
      case 'rooms':
        setRoomForm(item);
        break;
      case 'appointments':
        setAppointmentForm(item);
        break;
      case 'admissions':
        setAdmissionForm(item);
        break;
      case 'bills':
        setBillForm(item);
        break;
    }
  };

  const getItemId = (item) => {
    const idFields = {
      'patients': 'PatientID',
      'doctors': 'DoctorID',
      'departments': 'DepartmentID',
      'rooms': 'RoomID',
      'appointments': 'AppointmentID',
      'admissions': 'AdmissionID',
      'bills': 'BillID'
    };
    return item[idFields[activeTab]];
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const id = getItemId(item);
        await axios.delete(`${API_BASE_URL}/${activeTab}/${id}`);
        await fetchData(activeTab);
      } catch (err) {
        setError(`Failed to delete: ${err.message}`);
      }
    }
  };

  const renderForm = () => {
    const currentForm = getCurrentForm();
    const formFields = getFormFields();

    return (
      <div className="form-overlay">
        <div className="form-container">
          <h3>{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h3>
          <form onSubmit={handleSubmit}>
            {formFields.map(field => (
              <div key={field.name} className="form-field">
                <label>{field.label}:</label>
                {field.type === 'select' ? (
                  <select
                    value={currentForm[field.name]}
                    onChange={(e) => setCurrentFormState({
                      ...currentForm,
                      [field.name]: e.target.value
                    })}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={currentForm[field.name]}
                    onChange={(e) => setCurrentFormState({
                      ...currentForm,
                      [field.name]: e.target.value
                    })}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
              </button>
              <button type="button" onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                resetForm();
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getCurrentForm = () => {
    switch (activeTab) {
      case 'patients': return patientForm;
      case 'doctors': return doctorForm;
      case 'departments': return departmentForm;
      case 'rooms': return roomForm;
      case 'appointments': return appointmentForm;
      case 'admissions': return admissionForm;
      case 'bills': return billForm;
      default: return {};
    }
  };

  const setCurrentFormState = (newState) => {
    switch (activeTab) {
      case 'patients': setPatientForm(newState); break;
      case 'doctors': setDoctorForm(newState); break;
      case 'departments': setDepartmentForm(newState); break;
      case 'rooms': setRoomForm(newState); break;
      case 'appointments': setAppointmentForm(newState); break;
      case 'admissions': setAdmissionForm(newState); break;
      case 'bills': setBillForm(newState); break;
    }
  };

  const getFormFields = () => {
    const patientOptions = data.patients?.map(p => ({ value: p.PatientID, label: p.Name })) || [];
    const doctorOptions = data.doctors?.map(d => ({ value: d.DoctorID, label: d.Name })) || [];
    const departmentOptions = data.departments?.map(d => ({ value: d.DepartmentID, label: d.DepartmentName })) || [];
    const roomOptions = data.rooms?.map(r => ({ value: r.RoomID, label: `Room ${r.RoomID} (${r.RoomType})` })) || [];
    const admissionOptions = data.admissions?.map(a => ({ value: a.AdmissionID, label: `Admission ${a.AdmissionID}` })) || [];

    const fieldConfigs = {
      patients: [
        { name: 'Name', label: 'Name', required: true },
        { name: 'Age', label: 'Age', type: 'number', required: true },
        { name: 'Gender', label: 'Gender', type: 'select', options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' }
        ], required: true },
        { name: 'ContactNo', label: 'Contact Number', required: true },
        { name: 'Address', label: 'Address', required: true },
        { name: 'Disease', label: 'Disease', required: true }
      ],
      doctors: [
        { name: 'Name', label: 'Name', required: true },
        { name: 'Specialization', label: 'Specialization', required: true },
        { name: 'ContactNo', label: 'Contact Number', required: true },
        { name: 'DepartmentID', label: 'Department', type: 'select', options: departmentOptions, required: true }
      ],
      departments: [
        { name: 'DepartmentID', label: 'Department ID', type: 'number', required: true },
        { name: 'DepartmentName', label: 'Department Name', required: true },
        { name: 'Location', label: 'Location', required: true }
      ],
      rooms: [
        { name: 'RoomType', label: 'Room Type', type: 'select', options: [
          { value: 'General', label: 'General' },
          { value: 'ICU', label: 'ICU' },
          { value: 'Private', label: 'Private' },
          { value: 'Semi-Private', label: 'Semi-Private' }
        ], required: true },
        { name: 'Availability', label: 'Availability', type: 'select', options: [
          { value: 'Yes', label: 'Available' },
          { value: 'No', label: 'Not Available' }
        ], required: true }
      ],
      appointments: [
        { name: 'PatientID', label: 'Patient', type: 'select', options: patientOptions, required: true },
        { name: 'DoctorID', label: 'Doctor', type: 'select', options: doctorOptions, required: true },
        { name: 'AppointmentDate', label: 'Date', type: 'date', required: true },
        { name: 'Status', label: 'Status', type: 'select', options: [
          { value: 'Scheduled', label: 'Scheduled' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Cancelled', label: 'Cancelled' }
        ], required: true }
      ],
      admissions: [
        { name: 'PatientID', label: 'Patient', type: 'select', options: patientOptions, required: true },
        { name: 'RoomID', label: 'Room', type: 'select', options: roomOptions, required: true },
        { name: 'AdmissionDate', label: 'Admission Date', type: 'date', required: true },
        { name: 'DischargeDate', label: 'Discharge Date', type: 'date' }
      ],
      bills: [
        { name: 'PatientID', label: 'Patient', type: 'select', options: patientOptions, required: true },
        { name: 'AdmissionID', label: 'Admission', type: 'select', options: admissionOptions, required: true },
        { name: 'Amount', label: 'Amount', type: 'number', required: true },
        { name: 'PaymentStatus', label: 'Payment Status', type: 'select', options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Paid', label: 'Paid' },
          { value: 'Cancelled', label: 'Cancelled' }
        ], required: true }
      ]
    };

    return fieldConfigs[activeTab] || [];
  };

  const renderTable = () => {
    const currentData = data[activeTab] || [];
    
    if (currentData.length === 0) {
      return <div className="no-data">No data available</div>;
    }

    const headers = Object.keys(currentData[0]);
    const isViewTab = activeTab.startsWith('view-');

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
              {!isViewTab && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header}>
                    {item[header] === null ? 'N/A' : String(item[header])}
                  </td>
                ))}
                {!isViewTab && (
                  <td className="actions">
                    <button onClick={() => handleEdit(item)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs = [
    { key: 'patients', label: 'Patients' },
    { key: 'doctors', label: 'Doctors' },
    { key: 'departments', label: 'Departments' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'admissions', label: 'Admissions' },
    { key: 'bills', label: 'Bills' },
    { key: 'view-doctors', label: 'Doctor View' },
    { key: 'view-appointments', label: 'Appointment View' },
    { key: 'view-admissions', label: 'Admission View' },
    { key: 'view-bills', label: 'Bill View' }
  ];

  // Load dependencies when needed
  useEffect(() => {
    if (showForm && ['doctors', 'appointments', 'admissions', 'bills'].includes(activeTab)) {
      if (activeTab === 'doctors' && !data.departments) {
        fetchData('departments');
      }
      if (['appointments', 'admissions', 'bills'].includes(activeTab)) {
        if (!data.patients) fetchData('patients');
        if (activeTab === 'appointments' && !data.doctors) fetchData('doctors');
        if (activeTab === 'admissions' && !data.rooms) fetchData('rooms');
        if (activeTab === 'bills' && !data.admissions) fetchData('admissions');
      }
    }
  }, [showForm, activeTab]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏥 Hospital Database Management System</h1>
      </header>

      <nav className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <div className="content-header">
          <h2>{tabs.find(tab => tab.key === activeTab)?.label}</h2>
          {!activeTab.startsWith('view-') && (
            <button 
              className="add-button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              + Add {activeTab.slice(0, -1)}
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading...</div>}

        {renderTable()}

        {showForm && renderForm()}
      </main>
    </div>
  );
}

export default App;