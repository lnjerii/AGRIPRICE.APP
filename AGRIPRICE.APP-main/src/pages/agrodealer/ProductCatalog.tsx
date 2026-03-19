import { useEffect, useState } from 'react';
import { listProducts, deleteProduct } from '../../lib/mockApi';
import { Link } from 'react-router-dom';

export default function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const p = await listProducts();
        if (mounted) setProducts(p);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to load products');
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Product Catalog</h1>
        <Link to="/agrodealer/add-product">
          <button style={{ padding: '8px 12px', background: '#2FA44F', color: 'white', border: 'none', borderRadius: 6 }}>
            Add product
          </button>
        </Link>
      </div>

      {error && <div style={{ marginTop: 10, color: '#8b1e1e' }}>{error}</div>}

      <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
        {products.length === 0 ? (
          <div style={{ color: '#3f7a52' }}>No products found. Add your first product.</div>
        ) : (
          products.map((p) => (
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
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: '#3f7a52' }}>
                  {p.category} - {p.location || 'No location'}
                </div>
                <div style={{ color: '#3f7a52', fontSize: 13 }}>Stock: {p.stock ?? 0}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800 }}>{p.price} KES</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Link to="/agrodealer/stock">
                    <button style={{ padding: '6px 8px', borderRadius: 6 }}>Manage Stock</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(String(p.id))}
                    style={{ padding: '6px 8px', borderRadius: 6, background: '#2fa44f', color: 'white', border: 'none' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
