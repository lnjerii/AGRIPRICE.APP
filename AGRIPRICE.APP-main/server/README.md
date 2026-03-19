# AgriPrice Hub Backend

Express.js API server for AgriPrice Hub with SQLite database.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file from template:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your values:**
   ```
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-key-here
   DATABASE_URL=./agri_price.db
   FRONTEND_URL=http://localhost:5177
   ```

## Running the Server

**Development (watch mode):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001` (or your PORT value).

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products/search` - Search products (query params: q, county, category)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products` - List user's products (requires auth)
- `POST /api/products` - Create product (agrodealer only)
- `PUT /api/products/:id` - Update product (agrodealer only)
- `DELETE /api/products/:id` - Delete product (agrodealer only)

### Purchase Requests
- `POST /api/purchase-requests` - Create request (farmer only)
- `GET /api/purchase-requests` - List requests (requires auth)
- `PUT /api/purchase-requests/:id` - Update request status (agrodealer only)

### Price Submissions
- `POST /api/price-submissions` - Submit price (market officer only)
- `GET /api/price-submissions/officer/:id` - Get officer's submissions
- `GET /api/price-submissions/pending` - Get pending (admin only)
- `PUT /api/price-submissions/:id` - Approve/reject (admin only)
- `GET /api/price-submissions/market/:market` - Get market prices (farmer only)

### Admin
- `GET /api/admin/dashboard/stats` - Get system stats (admin only)
- `GET /api/admin/users` - List all users (admin only)
- `PUT /api/admin/users/:id/approve` - Approve user (admin only)
- `PUT /api/admin/users/:id/suspend` - Suspend user (admin only)
- `GET /api/admin/logs` - Get system logs (admin only)

## Authentication

All protected endpoints require a `Authorization: Bearer <token>` header.

Get a token by:
1. Signup: `POST /api/auth/signup`
2. Login: `POST /api/auth/login`

Tokens expire in 7 days.

## Database

SQLite database is created automatically on first run. Schema includes:
- `users` (farmers, agrodealer, officers, admins)
- `products` (farm inputs and tools)
- `purchase_requests` (farmer requests to suppliers)
- `price_submissions` (market prices submitted by officers)
- `admin_logs` (audit trail)
- `notifications` (future use)

## User Roles

- **farmer** - Search inputs, view prices, request purchases
- **agrodealer** - Sell products, manage inventory, handle requests
- **market_officer** - Submit daily market prices
- **admin** - Approve prices, manage users, view logs

## Example Signup Request

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123",
    "full_name": "John Farmer",
    "role": "farmer",
    "phone": "0712345678",
    "county": "Kiambu",
    "sub_location": "Lari"
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| NODE_ENV | Environment | development |
| JWT_SECRET | Secret for signing tokens | (required) |
| DATABASE_URL | SQLite file path | ./agri_price.db |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5177 |
