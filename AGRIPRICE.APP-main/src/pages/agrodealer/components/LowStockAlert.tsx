const lowStockItems = [
  { name: 'DAP Fertilizer', quantity: 5 },
  { name: 'Hybrid Maize Seeds', quantity: 8 },
];

export default function LowStockAlert() {
  return (
    <div className="card">
      <h2>⚠️ Low Stock Alerts</h2>

      {lowStockItems.length === 0 ? (
        <p>All products sufficiently stocked.</p>
      ) : (
        <ul>
          {lowStockItems.map((item) => (
            <li key={item.name}>
              {item.name} — <strong>{item.quantity} left</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
