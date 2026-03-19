import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listProducts, listPurchaseRequests } from '../../lib/mockApi';

export default function AgroDealerDashboard() {
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const navItems = [
    { to: '/agrodealer/dashboard', label: 'Dashboard' },
    { to: '/agrodealer/products', label: 'Products' },
    { to: '/agrodealer/add-product', label: 'Add Product' },
    { to: '/agrodealer/requests', label: 'Requests' },
    { to: '/agrodealer/stock', label: 'Stock' },
    { to: '/agrodealer/insights', label: 'Insights' },
    { to: '/agrodealer/notifications', label: 'Notifications' },
    { to: '/agrodealer/profile', label: 'Profile' },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [p, r] = await Promise.all([listProducts(), listPurchaseRequests()]);
        if (!mounted) return;
        setProducts(p);
        setRequests(r);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const lowStock = useMemo(() => products.filter((p) => (p.stock ?? 0) < 10), [products]);
  const pendingRequests = useMemo(() => requests.filter((r) => r.status === 'pending'), [requests]);

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
        <h3 style={{ marginTop: 0, marginBottom: 14, color: '#1f4d2d' }}>Agrodealer Menu</h3>
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
        <h1 style={{ color: '#1f4d2d' }}>Agro-dealer Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#3f7a52' }}>Total products</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{products.length}</div>
          </div>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#3f7a52' }}>Low stock items</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{lowStock.length}</div>
          </div>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#3f7a52' }}>Pending requests</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{pendingRequests.length}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: 16 }}>
          <section style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Low stock alerts</h3>
            {lowStock.length === 0 ? (
              <div style={{ color: '#3f7a52' }}>All products sufficiently stocked.</div>
            ) : (
              lowStock.slice(0, 5).map((item) => (
                <div key={item.id} style={{ padding: 8, borderBottom: '1px solid #e3efe6' }}>
                  {item.name} - <strong>{item.stock}</strong> left
                </div>
              ))
            )}
            <div style={{ marginTop: 8 }}>
              <Link to="/agrodealer/stock">Manage stock</Link>
            </div>
          </section>

          <section style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Recent purchase requests</h3>
            {requests.length === 0 ? (
              <div style={{ color: '#3f7a52' }}>No requests yet.</div>
            ) : (
              requests.slice(0, 5).map((r) => (
                <div key={r.id} style={{ padding: 8, borderBottom: '1px solid #e3efe6' }}>
                  {r.buyer_name} - {r.product_name} (x{r.quantity}) [{r.status}]
                </div>
              ))
            )}
            <div style={{ marginTop: 8 }}>
              <Link to="/agrodealer/requests">View all requests</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
