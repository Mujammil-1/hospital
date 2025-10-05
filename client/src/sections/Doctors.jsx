import React from 'react';
import axios from 'axios';

export function Doctors() {
  const [rows, setRows] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [form, setForm] = React.useState({ Name:'', Specialization:'', ContactNo:'', DepartmentID:'' });

  const load = async () => {
    const [d1, d2] = await Promise.all([
      axios.get('/api/doctors'),
      axios.get('/api/departments')
    ]);
    setRows(d1.data);
    setDepartments(d2.data);
  };

  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/doctors', { ...form, DepartmentID: Number(form.DepartmentID) || null });
    setForm({ Name:'', Specialization:'', ContactNo:'', DepartmentID:'' });
    await load();
  };

  return (
    <div>
      <h2>Doctors</h2>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <input placeholder="Name" value={form.Name} onChange={e=>setForm(f=>({...f, Name:e.target.value}))} required />
        <input placeholder="Specialization" value={form.Specialization} onChange={e=>setForm(f=>({...f, Specialization:e.target.value}))} />
        <input placeholder="ContactNo" value={form.ContactNo} onChange={e=>setForm(f=>({...f, ContactNo:e.target.value}))} />
        <select value={form.DepartmentID} onChange={e=>setForm(f=>({...f, DepartmentID:e.target.value}))}>
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d.DepartmentID} value={d.DepartmentID}>{d.DepartmentName}</option>
          ))}
        </select>
        <button type="submit" style={{ gridColumn: 'span 4' }}>Add Doctor</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Specialization</th><th>Contact</th><th>Department</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.DoctorID}>
              <td>{r.DoctorID}</td>
              <td>{r.Name}</td>
              <td>{r.Specialization}</td>
              <td>{r.ContactNo}</td>
              <td>{r.DepartmentID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
