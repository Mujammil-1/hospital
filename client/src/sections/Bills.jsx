import React from 'react';
import axios from 'axios';

export function Bills() {
  const [rows, setRows] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [admissions, setAdmissions] = React.useState([]);
  const [form, setForm] = React.useState({ PatientID:'', AdmissionID:'', Amount:'', PaymentStatus:'Pending' });

  const load = async () => {
    const [b, p, a] = await Promise.all([
      axios.get('/api/bills'),
      axios.get('/api/patients'),
      axios.get('/api/admissions')
    ]);
    setRows(b.data);
    setPatients(p.data);
    setAdmissions(a.data);
  };

  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/bills', {
      PatientID: Number(form.PatientID),
      AdmissionID: Number(form.AdmissionID),
      Amount: Number(form.Amount || 0),
      PaymentStatus: form.PaymentStatus
    });
    setForm({ PatientID:'', AdmissionID:'', Amount:'', PaymentStatus:'Pending' });
    await load();
  };

  return (
    <div>
      <h2>Bills</h2>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        <select value={form.PatientID} onChange={e=>setForm(f=>({...f, PatientID:e.target.value}))} required>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.PatientID} value={p.PatientID}>{p.Name}</option>
          ))}
        </select>
        <select value={form.AdmissionID} onChange={e=>setForm(f=>({...f, AdmissionID:e.target.value}))} required>
          <option value="">Select Admission</option>
          {admissions.map(a => (
            <option key={a.AdmissionID} value={a.AdmissionID}>#{a.AdmissionID}</option>
          ))}
        </select>
        <input type="number" placeholder="Amount" value={form.Amount} onChange={e=>setForm(f=>({...f, Amount:e.target.value}))} />
        <select value={form.PaymentStatus} onChange={e=>setForm(f=>({...f, PaymentStatus:e.target.value}))}>
          <option>Pending</option>
          <option>Paid</option>
        </select>
        <button type="submit" style={{ gridColumn: 'span 4' }}>Add Bill</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Amount</th><th>Status</th><th>Patient</th><th>Admission</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.BillID}>
              <td>{r.BillID}</td>
              <td>{r.Amount}</td>
              <td>{r.PaymentStatus}</td>
              <td>{r.PatientID}</td>
              <td>{r.AdmissionID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
