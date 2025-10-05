import React from 'react';
import axios from 'axios';

export function Patients() {
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState({ Name:'', Age:'', Gender:'Male', ContactNo:'', Address:'', Disease:'' });

  const load = async () => {
    const { data } = await axios.get('/api/patients');
    setRows(data);
  };

  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/patients', { ...form, Age: Number(form.Age || 0) });
    setForm({ Name:'', Age:'', Gender:'Male', ContactNo:'', Address:'', Disease:'' });
    await load();
  };

  return (
    <div>
      <h2>Patients</h2>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        <input placeholder="Name" value={form.Name} onChange={e=>setForm(f=>({...f, Name:e.target.value}))} required />
        <input type="number" placeholder="Age" value={form.Age} onChange={e=>setForm(f=>({...f, Age:e.target.value}))} />
        <select value={form.Gender} onChange={e=>setForm(f=>({...f, Gender:e.target.value}))}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input placeholder="ContactNo" value={form.ContactNo} onChange={e=>setForm(f=>({...f, ContactNo:e.target.value}))} />
        <input placeholder="Address" value={form.Address} onChange={e=>setForm(f=>({...f, Address:e.target.value}))} />
        <input placeholder="Disease" value={form.Disease} onChange={e=>setForm(f=>({...f, Disease:e.target.value}))} />
        <button type="submit" style={{ gridColumn: 'span 3' }}>Add Patient</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Address</th><th>Disease</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.PatientID}>
              <td>{r.PatientID}</td>
              <td>{r.Name}</td>
              <td>{r.Age}</td>
              <td>{r.Gender}</td>
              <td>{r.ContactNo}</td>
              <td>{r.Address}</td>
              <td>{r.Disease}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
