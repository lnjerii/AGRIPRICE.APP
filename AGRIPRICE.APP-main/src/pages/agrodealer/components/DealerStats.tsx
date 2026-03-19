//how is my business doing?
const stats = [
  { label: 'Total Products', value: 48 },
  { label: 'Active Listings', value: 41 },
  { label: 'Low Stock Items', value: 6 },
  { label: 'Purchase Requests', value: 12 },
];

export default function DealerStats() {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <h3>{stat.label}</h3>
          <p className="stat-number">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
