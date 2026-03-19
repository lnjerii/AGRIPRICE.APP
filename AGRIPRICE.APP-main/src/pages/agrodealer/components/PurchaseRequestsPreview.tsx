// src/pages/agrodealer/PurchaseRequestsPreview.tsx
const requests = [
  { farmer: 'John Mwangi', product: 'NPK Fertilizer', qty: 3 },
  { farmer: 'Alice Wanjiku', product: 'Tomato Seeds', qty: 10 },
];

export default function PurchaseRequestsPreview() {
  return (
    <div className="card">
      <h2>📥 Purchase Requests</h2>

      {requests.length === 0 ? (
        <p>No new requests.</p>
      ) : (
        <ul>
          {requests.map((r, index) => (
            <li key={index}>
              {r.farmer} → {r.product} ({r.qty})
            </li>
          ))}
        </ul>
      )}

      <button className="link-btn">View All Requests →</button>
    </div>
  );
}
