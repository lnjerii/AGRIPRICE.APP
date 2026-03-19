import { useEffect, useState } from 'react';
import { listPriceSubmissions, updatePriceSubmissionStatus } from '../../lib/mockApi';

export default function ApprovalQueue() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const s = await listPriceSubmissions();
      if (mounted) setItems(s.filter((x: any) => x.status === 'pending'));
    };
    load();
    return () => { mounted = false };
  }, []);

  const handle = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const updated = await updatePriceSubmissionStatus(id, status);
      setItems((prev) => prev.filter((p) => p.id !== id));
      console.log('Updated', updated);
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Price Approval Queue</h2>
      {items.length === 0 ? <div style={{ color: '#3f7a52' }}>No pending submissions</div> : (
        <div style={{ display: 'grid', gap: 8 }}>
          {items.map((it) => (
            <div key={it.id} style={{ padding: 12, borderRadius: 8, border: '1px solid #cde7d4', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{it.commodity} — {it.market}</div>
                <div style={{ color: '#3f7a52' }}>{it.unit} • {it.date}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handle(it.id, 'approved')} style={{ padding: '8px 10px', background: '#16A34A', color: 'white', border: 'none', borderRadius: 6 }}>Approve</button>
                <button onClick={() => handle(it.id, 'rejected')} style={{ padding: '8px 10px', background: '#2fa44f', color: 'white', border: 'none', borderRadius: 6 }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


