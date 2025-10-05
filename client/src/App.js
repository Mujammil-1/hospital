import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Departments from './components/Departments';
import Rooms from './components/Rooms';
import Appointments from './components/Appointments';
import Admissions from './components/Admissions';
import Bills from './components/Bills';
import Views from './components/Views';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🏥 Hospital Database</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/patients">Patients</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
            <li><Link to="/departments">Departments</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
            <li><Link to="/bills">Bills</Link></li>
            <li><Link to="/views">Views</Link></li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/views" element={<Views />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
