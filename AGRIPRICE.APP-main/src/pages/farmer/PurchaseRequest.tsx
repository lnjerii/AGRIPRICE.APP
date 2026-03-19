import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { submitPurchaseRequest } from '../../lib/mockApi';

export default function PurchaseRequest() {
  const loc = useLocation();
  const navigate = useNavigate();
  const product = (loc.state && (loc.state as any).product) || null;

  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) {
      setError('Please select a product from Search Inputs first.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await submitPurchaseRequest({
        product_id: product.id,
        quantity,
        fulfillment_type: delivery,
        delivery_location: delivery === 'delivery' ? deliveryLocation : null,
        phone,
      });
      navigate('/farmer/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#1f4d2d' }}>Purchase Request</h2>
      {!product && (
        <div style={{ marginBottom: 12, color: '#8b1e1e' }}>
          No product selected. <Link to="/farmer/search">Go to Search Inputs</Link> and pick one.
        </div>
      )}
      {error && (
        <div style={{ padding: 12, background: '#ffe9e9', color: '#8b1e1e', borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ maxWidth: 560, marginTop: 12, display: 'grid', gap: 12 }}>
        <div>
          <label htmlFor="request-product" style={{ display: 'block', marginBottom: 6, color: '#1f4d2d' }}>Product</label>
          <input
            id="request-product"
            readOnly
            value={product?.name || ''}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cde7d4' }}
          />
        </div>

        <div>
          <label htmlFor="request-quantity" style={{ display: 'block', marginBottom: 6, color: '#1f4d2d' }}>Quantity</label>
          <input
            id="request-quantity"
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cde7d4' }}
          />
        </div>

        <div>
          <label htmlFor="request-fulfillment" style={{ display: 'block', marginBottom: 6, color: '#1f4d2d' }}>Fulfillment</label>
          <select
            id="request-fulfillment"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value as 'pickup' | 'delivery')}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cde7d4' }}
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        {delivery === 'delivery' && (
          <div>
            <label htmlFor="request-delivery-location" style={{ display: 'block', marginBottom: 6, color: '#1f4d2d' }}>Delivery location</label>
            <input
              id="request-delivery-location"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Village / landmark"
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cde7d4' }}
            />
          </div>
        )}

        <div>
          <label htmlFor="request-phone" style={{ display: 'block', marginBottom: 6, color: '#1f4d2d' }}>Phone number</label>
          <input
            id="request-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxx"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cde7d4' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            disabled={submitting || !product}
            style={{ padding: '10px 14px', background: '#2FA44F', color: 'white', border: 'none', borderRadius: 6 }}
          >
            {submitting ? 'Submitting...' : 'Submit request'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ padding: '10px 14px', background: '#fff', color: '#1f4d2d', border: '1px solid #cde7d4', borderRadius: 6 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
