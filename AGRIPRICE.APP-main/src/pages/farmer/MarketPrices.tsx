import { useEffect, useState } from 'react';
import { fetchMarketPrices } from '../../lib/mockApi';
import MapPlaceholder from '../../components/MapPlaceholder';

export default function MarketPrices() {
  const [market, setMarket] = useState('Nairobi');
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchMarketPrices(market);
        if (mounted) setPrices(res);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to load market prices');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [market]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#1f4d2d' }}>Produce Market Prices</h2>
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label htmlFor="market-select" style={{ color: '#1f4d2d' }}>Market:</label>
        <select id="market-select" value={market} onChange={(e) => setMarket(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option>Nairobi</option>
          <option>Kiambu</option>
          <option>Nakuru</option>
          <option>Central Market</option>
        </select>
      </div>

      {error && <div style={{ marginTop: 10, color: '#8b1e1e' }}>{error}</div>}

      <div style={{ display: 'flex', gap: 20, marginTop: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {loading ? (
            <div>Loading prices...</div>
          ) : prices.length === 0 ? (
            <div style={{ color: '#3f7a52' }}>No approved prices yet for {market}.</div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {prices.map((p) => (
                <div
                  key={`${p.commodity}-${p.submission_date}-${p.price}`}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #cde7d4',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.commodity}</div>
                    <div style={{ color: '#3f7a52', fontSize: 13 }}>{p.unit}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800 }}>{p.price} KES</div>
                    <div style={{ color: '#3f7a52', fontSize: 12 }}>{p.submission_date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 420 }}>
          <h4 style={{ marginTop: 0 }}>Price trend (7 days)</h4>
          <div style={{ marginBottom: 12 }}>
            <MapPlaceholder height={160} />
          </div>
        </div>
      </div>
    </div>
  );
}
