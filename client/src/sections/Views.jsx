import React from 'react';
import axios from 'axios';

const viewNames = ['vw_Doctors','vw_Appointments','vw_Admissions','vw_Bills'];

export function Views() {
  const [selected, setSelected] = React.useState(viewNames[0]);
  const [rows, setRows] = React.useState([]);

  const load = async (name) => {
    const { data } = await axios.get(`/api/views/${name}`);
    setRows(data);
  };

  React.useEffect(() => { load(selected); }, [selected]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div>
      <h2>Views</h2>
      <div style={{ marginBottom: 12 }}>
        <select value={selected} onChange={e=>setSelected(e.target.value)}>
          {viewNames.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            {columns.map(c => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              {columns.map(c => <td key={c}>{String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
