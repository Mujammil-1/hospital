import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    RoomType: '',
    Availability: 'Yes'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rooms', formData);
      setMessage({ text: 'Room added successfully!', type: 'success' });
      setFormData({ RoomType: '', Availability: 'Yes' });
      fetchRooms();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error adding room: ' + error.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`/api/rooms/${id}`);
        setMessage({ text: 'Room deleted successfully!', type: 'success' });
        fetchRooms();
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (error) {
        setMessage({ text: 'Error deleting room: ' + error.message, type: 'error' });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🛏️ Room Management</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="form-section">
        <h3>Add New Room</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Room Type *</label>
              <select 
                name="RoomType" 
                value={formData.RoomType} 
                onChange={handleChange}
                required
              >
                <option value="">Select Room Type</option>
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="Private">Private</option>
                <option value="Semi-Private">Semi-Private</option>
              </select>
            </div>
            <div className="form-group">
              <label>Availability *</label>
              <select 
                name="Availability" 
                value={formData.Availability} 
                onChange={handleChange}
                required
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Room</button>
        </form>
      </div>

      <div className="table-section">
        <h3>All Rooms</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Room Type</th>
              <th>Availability</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.RoomID}>
                <td>{room.RoomID}</td>
                <td>{room.RoomType}</td>
                <td>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '5px',
                    background: room.Availability === 'Yes' ? '#d4edda' : '#f8d7da',
                    color: room.Availability === 'Yes' ? '#155724' : '#721c24'
                  }}>
                    {room.Availability}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(room.RoomID)}
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

export default Rooms;
