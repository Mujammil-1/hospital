import React from 'react';
import axios from 'axios';

const tableNames = ['Patient','Department','Doctor','Room','Appointment','Admission','Bill'];

export function Tables() {
  const [selected, setSelected] = React.useState(tableNames[0]);
  const [rows, setRows] = React.useState([]);

  const load = async (name) => {
    const { data } = await axios.get(`/api/tables/${name}`);
    setRows(data);
  };

  React.useEffect(() => { load(selected); }, [selected]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div>
      <h2>Tables</h2>
      <div style={{ marginBottom: 12 }}>
        <select value={selected} onChange={e=>setSelected(e.target.value)}>
          {tableNames.map(v => (
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
