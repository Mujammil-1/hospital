import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Views() {
  const [activeView, setActiveView] = useState('doctors');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchViewData(activeView);
  }, [activeView]);

  const fetchViewData = async (viewName) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/views/${viewName}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching view data:', error);
    }
    setLoading(false);
  };

  const renderTable = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (data.length === 0) {
      return <div className="loading">No data available</div>;
    }

    const columns = Object.keys(data[0]);

    return (
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>
                  {row[col] !== null && row[col] !== undefined
                    ? col.includes('Date')
                      ? new Date(row[col]).toLocaleDateString()
                      : row[col].toString()
                    : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="page-container">
      <h2 className="page-title">📊 Database Views</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        View comprehensive reports and aggregated data from the database
      </p>

      <div className="view-tabs">
        <button
          className={`view-tab ${activeView === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveView('doctors')}
        >
          👨‍⚕️ Doctors View
        </button>
        <button
          className={`view-tab ${activeView === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveView('appointments')}
        >
          📅 Appointments View
        </button>
        <button
          className={`view-tab ${activeView === 'admissions' ? 'active' : ''}`}
          onClick={() => setActiveView('admissions')}
        >
          🏥 Admissions View
        </button>
        <button
          className={`view-tab ${activeView === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveView('bills')}
        >
          💰 Bills View
        </button>
      </div>

      <div className="table-section">
        <h3>
          {activeView === 'doctors' && 'Doctors with Department Information'}
          {activeView === 'appointments' && 'Appointments with Patient and Doctor Details'}
          {activeView === 'admissions' && 'Admissions with Patient and Room Details'}
          {activeView === 'bills' && 'Bills with Patient Information'}
        </h3>
        {renderTable()}
      </div>
    </div>
  );
}

export default Views;
