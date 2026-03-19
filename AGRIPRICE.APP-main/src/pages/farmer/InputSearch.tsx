import { useEffect, useState } from 'react';
import { searchProducts } from '../../lib/mockApi';
import { Link } from 'react-router-dom';

export default function InputSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const doSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await searchProducts(query, {});
        if (mounted) setResults(res);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to search products');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const t = setTimeout(doSearch, 300);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [query]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#1f4d2d' }}>Search Inputs</h2>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by product or seller"
          style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #cde7d4' }}
        />
      </div>

      {error && <div style={{ marginBottom: 12, color: '#8b1e1e' }}>{error}</div>}

      {loading ? (
        <div>Loading results...</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {results.length === 0 ? (
            <div style={{ color: '#3f7a52' }}>No results found. Try different keywords or filters.</div>
          ) : (
            results.map((p) => (
              <div
                key={p.id}
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
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: '#3f7a52', fontSize: 13 }}>
                    {p.shop_name || p.seller_name} - {p.location || p.shop_location || 'Location not set'}
                  </div>
                  <div style={{ color: '#3f7a52', fontSize: 12 }}>Stock: {p.stock ?? 0}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{p.price} KES</div>
                  <Link to="/farmer/purchase-request" state={{ product: p }} style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: '#2FA44F',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      Request Purchase
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
