import { useEffect, useState } from 'react';
import { listPriceSubmissions, listPurchaseRequests } from '../../lib/mockApi';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const s = await listPriceSubmissions();
        const r = await listPurchaseRequests();
        if (mounted) {
          setSubmissions(s);
          setRequests(r);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #cde7d4' }}>
          <div style={{ color: '#3f7a52' }}>Total price submissions</div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{submissions.length}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #cde7d4' }}>
          <div style={{ color: '#3f7a52' }}>Pending purchase requests</div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{requests.length}</div>
        </div>
      </div>
    </div>
  );
}

