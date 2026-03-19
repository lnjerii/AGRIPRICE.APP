import React, { useState } from 'react';
import { addProduct } from '../../lib/mockApi';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Seeds');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await addProduct({ name, category, price, stock, location, description });
      navigate('/agrodealer/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Product</h1>
      {error && <div style={{ marginBottom: 10, color: '#8b1e1e' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: 'grid', gap: 12 }}>
        <div>
          <label htmlFor="product-name">Product name</label>
          <input
            id="product-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div>
          <label htmlFor="product-category">Category</label>
          <select
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          >
            <option>Seeds</option>
            <option>Fertilizers</option>
            <option>Chemicals</option>
            <option>Tools</option>
          </select>
        </div>
        <div>
          <label htmlFor="product-price">Price (KES)</label>
          <input
            id="product-price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div>
          <label htmlFor="product-stock">Stock</label>
          <input
            id="product-stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div>
          <label htmlFor="product-location">Location</label>
          <input
            id="product-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div>
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '10px 14px', background: '#2FA44F', color: 'white', border: 'none', borderRadius: 6 }}
          >
            {submitting ? 'Adding...' : 'Add product'}
          </button>
        </div>
      </form>
    </div>
  );
}
