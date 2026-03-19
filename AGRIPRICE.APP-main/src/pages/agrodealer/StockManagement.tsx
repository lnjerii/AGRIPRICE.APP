import { useEffect, useState } from 'react';
import { listProducts, updateProduct } from '../../lib/mockApi';

export default function StockManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const items = await listProducts();
        if (mounted) setProducts(items);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to load stock');
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const changeStock = (id: number, value: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: value } : p)));
  };

  const saveStock = async (product: any) => {
    setSavingId(product.id);
    try {
      await updateProduct(String(product.id), {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update stock');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Stock Management</h1>
      {error && <div style={{ marginBottom: 12, color: '#8b1e1e' }}>{error}</div>}
      {products.length === 0 ? (
        <div style={{ color: '#3f7a52' }}>No products available.</div>
      ) : (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: '1px solid #cde7d4',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ minWidth: 200 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: '#3f7a52', fontSize: 13 }}>{p.category}</div>
              </div>
              <input
                type="number"
                min={0}
                value={p.stock ?? 0}
                onChange={(e) => changeStock(p.id, Number(e.target.value))}
                style={{ width: 120, padding: 8, borderRadius: 6, border: '1px solid #cde7d4' }}
              />
              <button
                onClick={() => saveStock(p)}
                disabled={savingId === p.id}
                style={{ padding: '8px 12px', border: 'none', borderRadius: 6, background: '#2FA44F', color: 'white' }}
              >
                {savingId === p.id ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
