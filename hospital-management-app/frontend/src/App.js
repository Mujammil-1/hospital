import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  Bed, 
  Calendar, 
  FileText, 
  CreditCard,
  Eye
} from 'lucide-react';

// Import pages
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import RoomsPage from './pages/RoomsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import BillsPage from './pages/BillsPage';
import ViewsPage from './pages/ViewsPage';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/departments', label: 'Departments', icon: Building2 },
    { path: '/rooms', label: 'Rooms', icon: Bed },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admissions', label: 'Admissions', icon: FileText },
    { path: '/bills', label: 'Bills', icon: CreditCard },
    { path: '/views', label: 'Views', icon: Eye },
  ];

  return (
    <nav className="nav">
      <div className="container">
        <ul className="nav-list">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path} className="nav-item">
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={20} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>Hospital Management System</h1>
          </div>
        </header>
        
        <Navigation />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<PatientsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/views" element={<ViewsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;