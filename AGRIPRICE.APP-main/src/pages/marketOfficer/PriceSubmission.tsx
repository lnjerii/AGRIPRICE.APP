import React, { useState } from 'react';
import { submitPriceSubmission } from '../../lib/mockApi';
import { useNavigate } from 'react-router-dom';

export default function PriceSubmission() {
  const [commodity, setCommodity] = useState('Maize');
  const [market, setMarket] = useState('Nairobi');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState(1000);
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitPriceSubmission({ commodity, market, unit, price, submission_date: submissionDate });
      navigate('/officer/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Submit Produce Price</h2>
      {error && <div style={{ marginBottom: 10, color: '#8b1e1e' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: 'grid', gap: 12 }}>
        <div>
          <label htmlFor="submission-commodity">Commodity</label>
          <input id="submission-commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6 }} />
        </div>
        <div>
          <label htmlFor="submission-market">Market</label>
          <input id="submission-market" value={market} onChange={(e) => setMarket(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6 }} />
        </div>
        <div>
          <label htmlFor="submission-unit">Unit</label>
          <input id="submission-unit" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6 }} />
        </div>
        <div>
          <label htmlFor="submission-price">Price</label>
          <input
            id="submission-price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div>
          <label htmlFor="submission-date">Submission Date</label>
          <input
            id="submission-date"
            type="date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '10px 14px', background: '#2FA44F', color: 'white', border: 'none', borderRadius: 6 }}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
