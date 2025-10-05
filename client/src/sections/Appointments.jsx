import React from 'react';
import axios from 'axios';

export function Appointments() {
  const [rows, setRows] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);
  const [form, setForm] = React.useState({ PatientID:'', DoctorID:'', AppointmentDate:'', Status:'Scheduled' });

  const load = async () => {
    const [a, p, d] = await Promise.all([
      axios.get('/api/appointments'),
      axios.get('/api/patients'),
      axios.get('/api/doctors')
    ]);
    setRows(a.data);
    setPatients(p.data);
    setDoctors(d.data);
  };

  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/appointments', {
      PatientID: Number(form.PatientID),
      DoctorID: Number(form.DoctorID),
      AppointmentDate: form.AppointmentDate,
      Status: form.Status
    });
    setForm({ PatientID:'', DoctorID:'', AppointmentDate:'', Status:'Scheduled' });
    await load();
  };

  return (
    <div>
      <h2>Appointments</h2>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <select value={form.PatientID} onChange={e=>setForm(f=>({...f, PatientID:e.target.value}))} required>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.PatientID} value={p.PatientID}>{p.Name}</option>
          ))}
        </select>
        <select value={form.DoctorID} onChange={e=>setForm(f=>({...f, DoctorID:e.target.value}))} required>
          <option value="">Select Doctor</option>
          {doctors.map(d => (
            <option key={d.DoctorID} value={d.DoctorID}>{d.Name}</option>
          ))}
        </select>
        <input type="date" value={form.AppointmentDate} onChange={e=>setForm(f=>({...f, AppointmentDate:e.target.value}))} required />
        <select value={form.Status} onChange={e=>setForm(f=>({...f, Status:e.target.value}))}>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button type="submit" style={{ gridColumn: 'span 4' }}>Add Appointment</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Date</th><th>Status</th><th>Patient</th><th>Doctor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.AppointmentID}>
              <td>{r.AppointmentID}</td>
              <td>{r.AppointmentDate}</td>
              <td>{r.Status}</td>
              <td>{r.PatientID}</td>
              <td>{r.DoctorID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
