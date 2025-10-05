import React from 'react';
import axios from 'axios';

export function Admissions() {
  const [rows, setRows] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [form, setForm] = React.useState({ PatientID:'', RoomID:'', AdmissionDate:'', DischargeDate:'' });

  const load = async () => {
    const [a, p, r] = await Promise.all([
      axios.get('/api/admissions'),
      axios.get('/api/patients'),
      axios.get('/api/rooms?availableOnly=true')
    ]);
    setRows(a.data);
    setPatients(p.data);
    setRooms(r.data);
  };

  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/admissions', {
      PatientID: Number(form.PatientID),
      RoomID: Number(form.RoomID),
      AdmissionDate: form.AdmissionDate,
      DischargeDate: form.DischargeDate || null
    });
    setForm({ PatientID:'', RoomID:'', AdmissionDate:'', DischargeDate:'' });
    await load();
  };

  return (
    <div>
      <h2>Admissions</h2>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <select value={form.PatientID} onChange={e=>setForm(f=>({...f, PatientID:e.target.value}))} required>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.PatientID} value={p.PatientID}>{p.Name}</option>
          ))}
        </select>
        <select value={form.RoomID} onChange={e=>setForm(f=>({...f, RoomID:e.target.value}))} required>
          <option value="">Select Room</option>
          {rooms.map(r => (
            <option key={r.RoomID} value={r.RoomID}>{r.RoomType} (#{r.RoomID})</option>
          ))}
        </select>
        <input type="date" value={form.AdmissionDate} onChange={e=>setForm(f=>({...f, AdmissionDate:e.target.value}))} required />
        <input type="date" value={form.DischargeDate} onChange={e=>setForm(f=>({...f, DischargeDate:e.target.value}))} />
        <button type="submit" style={{ gridColumn: 'span 4' }}>Add Admission</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>AdmissionDate</th><th>DischargeDate</th><th>Room</th><th>Patient</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.AdmissionID}>
              <td>{r.AdmissionID}</td>
              <td>{r.AdmissionDate}</td>
              <td>{r.DischargeDate || '-'}</td>
              <td>{r.RoomID}</td>
              <td>{r.PatientID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
