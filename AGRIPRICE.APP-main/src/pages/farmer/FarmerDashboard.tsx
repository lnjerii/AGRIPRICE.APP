import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listPurchaseRequests, searchProducts } from '../../lib/mockApi';
import MapPlaceholder from '../../components/MapPlaceholder';

export default function FarmerDashboard() {
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const navItems = [
    { to: '/farmer/dashboard', label: 'Dashboard' },
    { to: '/farmer/search', label: 'Search Inputs' },
    { to: '/farmer/market-prices', label: 'Market Prices' },
    { to: '/farmer/purchase-request', label: 'Purchase Request' },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [p, r] = await Promise.all([searchProducts('', {}), listPurchaseRequests()]);
        if (!mounted) return;
        setProducts(p.slice(0, 5));
        setRequests(r.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px minmax(0, 1fr)',
        gap: 20,
        padding: 20,
        background: '#ffffff',
      }}
    >
      <aside
        style={{
          background: '#ffffff',
          border: '1px solid #cde7d4',
          borderRadius: 12,
          padding: 16,
          position: 'sticky',
          top: 90,
          height: 'fit-content',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 14, color: '#1f4d2d' }}>Farmer Menu</h3>
        <nav style={{ display: 'grid', gap: 8 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${isActive ? '#2fa44f' : '#cde7d4'}`,
                  background: isActive ? '#eaf7ee' : '#ffffff',
                  color: '#1f4d2d',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div style={{ minWidth: 0 }}>
        <h1 style={{ color: '#1f4d2d' }}>Farmer Dashboard</h1>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: 16 }}>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 10, padding: 14 }}>
            <h3 style={{ marginTop: 0, color: '#1f4d2d' }}>Recent products</h3>
            {products.length === 0 ? (
              <div style={{ color: '#3f7a52' }}>No products available yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {products.map((p) => (
                  <div key={p.id} style={{ padding: 10, border: '1px solid #e3efe6', borderRadius: 8 }}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: '#3f7a52' }}>
                      {p.shop_name || p.seller_name} - {p.location || p.shop_location || 'Location not set'}
                    </div>
                    <div style={{ fontWeight: 700 }}>{p.price} KES</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <Link to="/farmer/search">Search all inputs</Link>
            </div>
          </div>

          <div style={{ border: '1px solid #cde7d4', borderRadius: 10, padding: 14 }}>
            <h3 style={{ marginTop: 0, color: '#1f4d2d' }}>My purchase requests</h3>
            {requests.length === 0 ? (
              <div style={{ color: '#3f7a52' }}>No requests submitted yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {requests.map((r) => (
                  <div key={r.id} style={{ padding: 10, border: '1px solid #e3efe6', borderRadius: 8 }}>
                    <div style={{ fontWeight: 600 }}>{r.product_name}</div>
                    <div style={{ fontSize: 13, color: '#3f7a52' }}>Qty: {r.quantity} | {r.fulfillment_type}</div>
                    <div style={{ fontSize: 13 }}>
                      Status: <strong>{r.status}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: '#1f4d2d' }}>Nearby agrovets map</h3>
          <MapPlaceholder height={220} />
        </div>
      </div>
    </div>
  );
}
