import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Home(){
  const [leads, setLeads] = useState([]);
  useEffect(()=>{ fetch(); }, []);
  async function fetch(){
    const res = await axios.get((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api') + '/leads');
    setLeads(res.data);
  }
  return (
    <div style={{fontFamily:'system-ui, sans-serif', padding:20}}>
      <h1>Leads</h1>
      <p>Local dev MVP — click a lead to view</p>
      <div>
        {leads.map(l => (
          <div key={l.lead_id} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}>
            <div style={{fontWeight:600}}>{l.address}</div>
            <div>Est: ${l.estimated_value}</div>
            <div>Score: {l.motivation_score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
