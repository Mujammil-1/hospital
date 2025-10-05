import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

function useOptions() {
  const [options, setOptions] = useState({ departments: [], doctors: [], patients: [], rooms: [], admissions: [] })
  useEffect(() => {
    Promise.all([
      api.get('/options/departments'),
      api.get('/options/doctors'),
      api.get('/options/patients'),
      api.get('/options/rooms'),
      api.get('/options/admissions')
    ]).then(([dep, doc, pat, room, adm]) => {
      setOptions({
        departments: dep.data,
        doctors: doc.data,
        patients: pat.data,
        rooms: room.data,
        admissions: adm.data
      })
    }).catch(() => {})
  }, [])
  return options
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Table({ rows }) {
  if (!rows || rows.length === 0) return <div>No data</div>
  const headers = Object.keys(rows[0])
  return (
    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {headers.map(h => <th key={h} style={{ textTransform: 'capitalize' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={idx}>
            {headers.map(h => <td key={h}>{String(r[h] ?? '')}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Patients() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ Name: '', Age: '', Gender: 'Male', ContactNo: '', Address: '', Disease: '' })
  useEffect(() => { api.get('/patients').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Patients">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/patients', { ...form, Age: form.Age ? Number(form.Age) : null }); const r = await api.get('/patients'); setRows(r.data) }}>
        <input placeholder="Name" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} required />
        <input placeholder="Age" type="number" value={form.Age} onChange={e => setForm({ ...form, Age: e.target.value })} />
        <select value={form.Gender} onChange={e => setForm({ ...form, Gender: e.target.value })}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input placeholder="ContactNo" value={form.ContactNo} onChange={e => setForm({ ...form, ContactNo: e.target.value })} />
        <input placeholder="Address" value={form.Address} onChange={e => setForm({ ...form, Address: e.target.value })} />
        <input placeholder="Disease" value={form.Disease} onChange={e => setForm({ ...form, Disease: e.target.value })} />
        <button type="submit">Add Patient</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Departments() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ DepartmentID: '', DepartmentName: '', Location: '' })
  useEffect(() => { api.get('/departments').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Departments">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/departments', { ...form, DepartmentID: Number(form.DepartmentID) }); const r = await api.get('/departments'); setRows(r.data) }}>
        <input placeholder="DepartmentID" type="number" value={form.DepartmentID} onChange={e => setForm({ ...form, DepartmentID: e.target.value })} required />
        <input placeholder="DepartmentName" value={form.DepartmentName} onChange={e => setForm({ ...form, DepartmentName: e.target.value })} required />
        <input placeholder="Location" value={form.Location} onChange={e => setForm({ ...form, Location: e.target.value })} />
        <button type="submit">Add Department</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Doctors() {
  const [rows, setRows] = useState([])
  const options = useOptions()
  const [form, setForm] = useState({ Name: '', Specialization: '', ContactNo: '', DepartmentID: '' })
  useEffect(() => { api.get('/doctors').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Doctors">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/doctors', { ...form, DepartmentID: Number(form.DepartmentID) }); const r = await api.get('/doctors'); setRows(r.data) }}>
        <input placeholder="Name" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} required />
        <input placeholder="Specialization" value={form.Specialization} onChange={e => setForm({ ...form, Specialization: e.target.value })} />
        <input placeholder="ContactNo" value={form.ContactNo} onChange={e => setForm({ ...form, ContactNo: e.target.value })} />
        <select value={form.DepartmentID} onChange={e => setForm({ ...form, DepartmentID: e.target.value })} required>
          <option value="">Select Department</option>
          {options.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button type="submit">Add Doctor</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Rooms() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ RoomType: 'General', Availability: 'Yes' })
  useEffect(() => { api.get('/rooms').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Rooms">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/rooms', form); const r = await api.get('/rooms'); setRows(r.data) }}>
        <select value={form.RoomType} onChange={e => setForm({ ...form, RoomType: e.target.value })}>
          <option>General</option>
          <option>ICU</option>
          <option>Private</option>
          <option>Semi-Private</option>
        </select>
        <select value={form.Availability} onChange={e => setForm({ ...form, Availability: e.target.value })}>
          <option>Yes</option>
          <option>No</option>
        </select>
        <button type="submit">Add Room</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Appointments() {
  const [rows, setRows] = useState([])
  const options = useOptions()
  const [form, setForm] = useState({ PatientID: '', DoctorID: '', AppointmentDate: '', Status: 'Scheduled' })
  useEffect(() => { api.get('/appointments').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Appointments">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/appointments', { ...form, PatientID: Number(form.PatientID), DoctorID: Number(form.DoctorID) }); const r = await api.get('/appointments'); setRows(r.data) }}>
        <select value={form.PatientID} onChange={e => setForm({ ...form, PatientID: e.target.value })} required>
          <option value="">Select Patient</option>
          {options.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.DoctorID} onChange={e => setForm({ ...form, DoctorID: e.target.value })} required>
          <option value="">Select Doctor</option>
          {options.doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input type="date" value={form.AppointmentDate} onChange={e => setForm({ ...form, AppointmentDate: e.target.value })} required />
        <select value={form.Status} onChange={e => setForm({ ...form, Status: e.target.value })}>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button type="submit">Add Appointment</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Admissions() {
  const [rows, setRows] = useState([])
  const options = useOptions()
  const [form, setForm] = useState({ PatientID: '', RoomID: '', AdmissionDate: '', DischargeDate: '' })
  useEffect(() => { api.get('/admissions').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Admissions">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/admissions', { ...form, PatientID: Number(form.PatientID), RoomID: Number(form.RoomID), DischargeDate: form.DischargeDate || null }); const r = await api.get('/admissions'); setRows(r.data) }}>
        <select value={form.PatientID} onChange={e => setForm({ ...form, PatientID: e.target.value })} required>
          <option value="">Select Patient</option>
          {options.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.RoomID} onChange={e => setForm({ ...form, RoomID: e.target.value })} required>
          <option value="">Select Room</option>
          {options.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input type="date" value={form.AdmissionDate} onChange={e => setForm({ ...form, AdmissionDate: e.target.value })} required />
        <input type="date" value={form.DischargeDate} onChange={e => setForm({ ...form, DischargeDate: e.target.value })} />
        <button type="submit">Add Admission</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Bills() {
  const [rows, setRows] = useState([])
  const options = useOptions()
  const [form, setForm] = useState({ PatientID: '', AdmissionID: '', Amount: '', PaymentStatus: 'Pending' })
  useEffect(() => { api.get('/bills').then(r => setRows(r.data)) }, [])
  return (
    <Section title="Bills">
      <form onSubmit={async e => { e.preventDefault(); await api.post('/bills', { ...form, PatientID: Number(form.PatientID), AdmissionID: Number(form.AdmissionID), Amount: Number(form.Amount) }); const r = await api.get('/bills'); setRows(r.data) }}>
        <select value={form.PatientID} onChange={e => setForm({ ...form, PatientID: e.target.value })} required>
          <option value="">Select Patient</option>
          {options.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={form.AdmissionID} onChange={e => setForm({ ...form, AdmissionID: e.target.value })} required>
          <option value="">Select Admission</option>
          {options.admissions.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input placeholder="Amount" type="number" value={form.Amount} onChange={e => setForm({ ...form, Amount: e.target.value })} required />
        <select value={form.PaymentStatus} onChange={e => setForm({ ...form, PaymentStatus: e.target.value })}>
          <option>Pending</option>
          <option>Paid</option>
        </select>
        <button type="submit">Add Bill</button>
      </form>
      <Table rows={rows} />
    </Section>
  )
}

function Views() {
  const [view, setView] = useState('doctors')
  const [rows, setRows] = useState([])
  useEffect(() => { api.get(`/views/${view}`).then(r => setRows(r.data)) }, [view])
  return (
    <Section title="Views">
      <select value={view} onChange={e => setView(e.target.value)}>
        <option value="doctors">vw_Doctors</option>
        <option value="appointments">vw_Appointments</option>
        <option value="admissions">vw_Admissions</option>
        <option value="bills">vw_Bills</option>
      </select>
      <Table rows={rows} />
    </Section>
  )
}

export default function App() {
  const [tab, setTab] = useState('patients')
  const baseUrl = useMemo(() => {
    // Allow proxying in dev via Vite and use Nginx path in prod
    const isDev = typeof window !== 'undefined' && window.location.port === '5173'
    return isDev ? 'http://localhost:4000' : ''
  }, [])
  useEffect(() => {
    api.defaults.baseURL = `${baseUrl}/api`
  }, [baseUrl])

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>HospitalDB Admin</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {['patients','departments','doctors','rooms','appointments','admissions','bills','views'].map(name => (
          <button key={name} onClick={() => setTab(name)} disabled={tab === name}>{name}</button>
        ))}
      </nav>
      {tab === 'patients' && <Patients />}
      {tab === 'departments' && <Departments />}
      {tab === 'doctors' && <Doctors />}
      {tab === 'rooms' && <Rooms />}
      {tab === 'appointments' && <Appointments />}
      {tab === 'admissions' && <Admissions />}
      {tab === 'bills' && <Bills />}
      {tab === 'views' && <Views />}
    </div>
  )
}
