import { useEffect, useState } from 'react';
import { listPurchaseRequests, updatePurchaseRequestStatus } from '../../lib/mockApi';

export default function PurchaseRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const r = await listPurchaseRequests();
        if (mounted) setRequests(r);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to load requests');
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handle = async (id: string, action: 'accept' | 'reject') => {
    const nextStatus = action === 'accept' ? 'accepted' : 'rejected';
    try {
      await updatePurchaseRequestStatus(id, nextStatus);
      setRequests((prev) => prev.map((p) => (String(p.id) === id ? { ...p, status: nextStatus } : p)));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update request');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Purchase Requests</h1>
      {error && <div style={{ marginBottom: 12, color: '#8b1e1e' }}>{error}</div>}
      {requests.length === 0 ? (
        <div style={{ color: '#3f7a52' }}>No requests yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {requests.map((r) => (
            <div
              key={r.id}
              style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid #cde7d4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {r.product_name} - x{r.quantity}
                </div>
                <div style={{ color: '#3f7a52' }}>
                  {r.fulfillment_type} - {r.phone} - Buyer: {r.buyer_name}
                </div>
                <div style={{ fontSize: 13 }}>
                  Status: <strong>{r.status}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  disabled={r.status !== 'pending'}
                  onClick={() => handle(String(r.id), 'accept')}
                  style={{
                    padding: '8px 10px',
                    background: '#2FA44F',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    opacity: r.status === 'pending' ? 1 : 0.6,
                  }}
                >
                  Accept
                </button>
                <button
                  disabled={r.status !== 'pending'}
                  onClick={() => handle(String(r.id), 'reject')}
                  style={{
                    padding: '8px 10px',
                    background: '#2fa44f',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    opacity: r.status === 'pending' ? 1 : 0.6,
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
