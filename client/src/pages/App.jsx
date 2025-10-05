import React from 'react';
import { Patients } from '../sections/Patients.jsx';
import { Doctors } from '../sections/Doctors.jsx';
import { Appointments } from '../sections/Appointments.jsx';
import { Admissions } from '../sections/Admissions.jsx';
import { Bills } from '../sections/Bills.jsx';
import { Views } from '../sections/Views.jsx';
import { Tables } from '../sections/Tables.jsx';

export default function App() {
  const [tab, setTab] = React.useState('patients');
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <h1>HospitalDB</h1>
      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          ['patients','Patients'],
          ['doctors','Doctors'],
          ['appointments','Appointments'],
          ['admissions','Admissions'],
          ['bills','Bills'],
          ['views','Views'],
          ['tables','Tables']
        ].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', background: tab===id?'#eef':'#fff' }}>
            {label}
          </button>
        ))}
      </nav>

      {tab==='patients' && <Patients />}
      {tab==='doctors' && <Doctors />}
      {tab==='appointments' && <Appointments />}
      {tab==='admissions' && <Admissions />}
      {tab==='bills' && <Bills />}
      {tab==='views' && <Views />}
      {tab==='tables' && <Tables />}
    </div>
  );
}
