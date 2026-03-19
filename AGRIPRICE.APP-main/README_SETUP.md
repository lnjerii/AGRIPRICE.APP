# AgriPrice Hub — Complete System

Full-stack agricultural marketplace connecting farmers, agro-dealers, and market officers through transparent pricing and inventory management.

## Project Structure

```
AgriPrice.Hub/
├── src/                 # React frontend (Vite + TypeScript)
├── server/              # Express.js backend (Node.js)
├── package.json         # Frontend dependencies
└── README.md            # This file
```

## Quick Start

### Prerequisites
- Node.js v16+ installed
- npm or yarn package manager

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Start Both Servers (in separate terminals)

**Terminal 1 — Frontend (Vite dev server):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5177`

**Terminal 2 — Backend (Express API):**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:3001`

### 4. Open the app
Visit `http://localhost:5177` in your browser.

## System Architecture

### Frontend (React + TypeScript + Vite)
- User interface for all roles (Farmer, Agro-Dealer, Market Officer, Admin)
- Routes for authentication, dashboards, product search, purchase requests, price submissions
- Design tokens (white + green color scheme)
- Responsive layouts (mobile + desktop)
- Real API client (`src/lib/mockApi.ts`) that calls the backend

### Backend (Express.js + SQLite)
- RESTful API with JWT authentication
- SQLite database with full schema (users, products, purchase requests, prices, logs)
- Role-based access control (RBAC)
- Endpoints for:
  - User auth (signup, login)
  - Product management (search, CRUD)
  - Purchase requests (create, list, update status)
  - Price submissions (submit, approve, list)
  - Admin tools (user management, system logs, approvals)

## User Roles & Access

| Role | Capabilities |
|------|---|
| **Farmer** | Search inputs, view market prices, request purchases, view requests |
| **Agro-Dealer** | Add/manage products, view inventory, accept/reject purchase requests |
| **Market Officer** | Submit daily produce prices, view submission history |
| **Admin** | Approve prices, manage users, view system logs, audit trail |

## API Documentation

See [server/README.md](server/README.md) for full API endpoint documentation.

**Quick examples:**

```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "password123",
    "full_name": "John Farmer",
    "role": "farmer",
    "county": "Kiambu"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "farmer@test.com", "password": "password123"}'

# Search products
curl "http://localhost:3001/api/products/search?q=maize&category=Seeds"
```

## UI/UX Design

The system includes comprehensive Miro-ready wireframes and design tokens for:
- **Landing & Marketing**: Hero, features, How it works, FAQ
- **Authentication**: Role selection, signup, login, password recovery
- **Farmer Flows**: Dashboard, input search, market prices, purchase requests
- **Supplier Flows**: Product catalog, add/edit products, purchase requests
- **Market Officer**: Dashboard, price submission, history
- **Admin**: User management, price approval, system logs

Design tokens (colors, typography, spacing) are in `src/design-tokens.ts` (white + green theme).

## Environment Variables

Create `.env` files in both frontend and server if needed:

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001/api
```

**Server (server/.env):**
```
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=./agri_price.db
FRONTEND_URL=http://localhost:5177
```

## Database

The backend automatically creates an SQLite database (`agri_price.db`) on first run with the following tables:

- `users` — User accounts and profiles
- `products` — Farm inputs and tools for sale
- `purchase_requests` — Orders from farmers to suppliers
- `price_submissions` — Market prices submitted by officers
- `admin_logs` — Audit trail of admin actions
- `notifications` — Future notifications system

## Development Commands

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
cd server
npm run dev      # Start Express with ts-node (watch mode)
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled version
```

## Testing the Flow

1. **Signup as Farmer**: Signup with role `farmer`, then log in
2. **Search Products**: Use the search bar on the dashboard
3. **Request Purchase**: Click "Request Purchase" on a product
4. **Signup as Agro-Dealer**: Create a dealer account
5. **Add Products**: Go to product catalog and add items
6. **Handle Requests**: View incoming purchase requests and accept/reject

## Troubleshooting

**"Cannot find module" errors in backend:**
```bash
cd server
npm install
npm run build
```

**API returns 401 Unauthorized:**
- Check that backend is running on `http://localhost:3001`
- Verify JWT token exists (`localStorage.getItem('agri-token')`)

**Frontend can't reach backend:**
- Ensure CORS is enabled (see server `app.use(cors())`)
- Check `API_URL` in `src/lib/mockApi.ts` matches backend PORT

**SQLite database issues:**
Reset the database:
```bash
rm agri_price.db  # or server/agri_price.db
npm run dev       # Restart backend to recreate DB
```

## Future Enhancements

- Supabase integration (auth + real-time DB)
- Google Maps for supplier location
- SMS/Push notifications
- Price trend charts
- Farmer wallet/payment integration
- Multi-language support
- Mobile app (React Native)

## Contributors

Built with ❤️ for African farmers and agribusinesses.

## License

MIT
