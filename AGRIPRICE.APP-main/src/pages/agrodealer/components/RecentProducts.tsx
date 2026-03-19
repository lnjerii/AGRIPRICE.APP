// src/pages/agrodealer/RecentProducts.tsx
const products = [
  { name: 'Hybrid Maize', price: 3200, stock: 40 },
  { name: 'Knapsack Sprayer', price: 4500, stock: 12 },
];

export default function RecentProducts() {
  return (
    <div className="section">
      <h2>🛒 Recently Updated Products</h2>

      <table className="simple-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (KES)</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
