import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Patients', description: 'Manage patient records', path: '/patients', icon: '👥' },
    { title: 'Doctors', description: 'Manage doctor information', path: '/doctors', icon: '👨‍⚕️' },
    { title: 'Departments', description: 'Manage hospital departments', path: '/departments', icon: '🏢' },
    { title: 'Rooms', description: 'Manage room availability', path: '/rooms', icon: '🛏️' },
    { title: 'Appointments', description: 'Schedule and manage appointments', path: '/appointments', icon: '📅' },
    { title: 'Admissions', description: 'Track patient admissions', path: '/admissions', icon: '🏥' },
    { title: 'Bills', description: 'Manage billing information', path: '/bills', icon: '💰' },
    { title: 'Views', description: 'View database reports', path: '/views', icon: '📊' },
  ];

  return (
    <div className="page-container">
      <h2 className="page-title">Hospital Database Management System</h2>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        Welcome to the Hospital Database Management System. Select a module to get started.
      </p>
      <div className="home-grid">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="home-card"
            onClick={() => navigate(card.path)}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
