import { useEffect, useMemo, useState } from 'react';
import { listPriceSubmissions } from '../../lib/mockApi';

export default function MarketReports() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await listPriceSubmissions();
        if (mounted) setSubmissions(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const commoditySummary = useMemo(() => {
    const map = new Map<string, { commodity: string; entries: number; latestPrice: number | null }>();
    submissions.forEach((s) => {
      const existing = map.get(s.commodity);
      if (!existing) {
        map.set(s.commodity, { commodity: s.commodity, entries: 1, latestPrice: s.price ?? null });
        return;
      }
      existing.entries += 1;
      existing.latestPrice = s.price ?? existing.latestPrice;
      map.set(s.commodity, existing);
    });
    return Array.from(map.values());
  }, [submissions]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Market Reports</h2>
      {submissions.length === 0 ? (
        <p style={{ color: '#3f7a52' }}>No submissions yet. Submit prices to build reports.</p>
      ) : (
        <>
          <div style={{ marginBottom: 16, color: '#3f7a52' }}>Total submissions: {submissions.length}</div>
          <div style={{ display: 'grid', gap: 10, maxWidth: 700 }}>
            {commoditySummary.map((item) => (
              <div key={item.commodity} style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 700 }}>{item.commodity}</div>
                <div style={{ color: '#3f7a52', fontSize: 14 }}>Entries: {item.entries}</div>
                <div style={{ color: '#3f7a52', fontSize: 14 }}>Latest price: {item.latestPrice ?? 0} KES</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
