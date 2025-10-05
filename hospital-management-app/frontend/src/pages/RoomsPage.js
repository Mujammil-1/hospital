import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { roomsAPI } from '../services/api';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    RoomType: '',
    Availability: 'Yes'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getAll();
      setRooms(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomsAPI.update(editingRoom.RoomID, formData);
      } else {
        await roomsAPI.create(formData);
      }
      setShowModal(false);
      setEditingRoom(null);
      setFormData({
        RoomType: '',
        Availability: 'Yes'
      });
      fetchRooms();
    } catch (err) {
      setError('Failed to save room');
      console.error(err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      RoomType: room.RoomType,
      Availability: room.Availability
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomsAPI.delete(id);
        fetchRooms();
      } catch (err) {
        setError('Failed to delete room');
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

  if (loading) return <div className="loading">Loading rooms...</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Rooms</h2>
          <button 
            className="btn" 
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Room
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Type</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.RoomID}>
                  <td>{room.RoomID}</td>
                  <td>{room.RoomType}</td>
                  <td>
                    <span className={`availability-${room.Availability.toLowerCase()}`}>
                      {room.Availability}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(room)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(room.RoomID)}
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
              <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingRoom(null);
                  setFormData({
                    RoomType: '',
                    Availability: 'Yes'
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room Type *</label>
                <select
                  name="RoomType"
                  value={formData.RoomType}
                  onChange={handleInputChange}
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
                <label>Availability</label>
                <select
                  name="Availability"
                  value={formData.Availability}
                  onChange={handleInputChange}
                >
                  <option value="Yes">Available</option>
                  <option value="No">Not Available</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoom(null);
                    setFormData({
                      RoomType: '',
                      Availability: 'Yes'
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingRoom ? 'Update' : 'Add'} Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;