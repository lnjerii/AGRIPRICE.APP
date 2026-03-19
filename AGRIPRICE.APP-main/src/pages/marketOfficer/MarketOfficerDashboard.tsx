import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listPriceSubmissions } from '../../lib/mockApi';

export default function MarketOfficerDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const location = useLocation();

  const navItems = [
    { to: '/officer/dashboard', label: 'Dashboard' },
    { to: '/officer/submit-price', label: 'Submit Price' },
    { to: '/officer/reports', label: 'Market Reports' },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await listPriceSubmissions();
        if (mounted) setSubmissions(res);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const pendingCount = useMemo(() => submissions.filter((s) => s.status === 'pending').length, [submissions]);
  const approvedCount = useMemo(() => submissions.filter((s) => s.status === 'approved').length, [submissions]);

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
        <h3 style={{ marginTop: 0, marginBottom: 14, color: '#1f4d2d' }}>Officer Menu</h3>
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
        <h1 style={{ color: '#1f4d2d' }}>Market Officer Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#3f7a52' }}>Total submissions</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{submissions.length}</div>
          </div>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#3f7a52' }}>Pending</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{pendingCount}</div>
          </div>
          <div style={{ border: '1px solid #cde7d4', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#3f7a52' }}>Approved</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{approvedCount}</div>
          </div>
        </div>

        <section style={{ marginTop: 12 }}>
          <h3>Recent price submissions</h3>
          {submissions.length === 0 ? (
            <div style={{ color: '#3f7a52' }}>No submissions yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {submissions.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #cde7d4',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {s.commodity} - {s.market}
                    </div>
                    <div style={{ color: '#3f7a52' }}>
                      {s.unit} - {s.submission_date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800 }}>{s.price} KES</div>
                    <div style={{ marginTop: 6 }}>
                      <span
                        style={{
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: s.status === 'approved' ? '#2fa44f' : '#5bbf73',
                          color: 'white',
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
