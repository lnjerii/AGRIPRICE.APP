import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init.js';
import { authMiddleware } from './middleware/auth.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import purchaseRequestRoutes from './routes/purchaseRequests.js';
import priceSubmissionRoutes from './routes/priceSubmissions.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

function buildAllowedOrigins() {
  // Support common Vite defaults and comma-separated FRONTEND_URL values.
  const defaults = ['http://localhost:5173', 'http://localhost:5177'];
  const extra = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...extra]));
}

const allowedOrigins = buildAllowedOrigins();
const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header), and configured frontend origins.
      if (!origin || allowedOrigins.includes(origin) || localhostPattern.test(origin)) {
        callback(null, true);
        return;
      }
      // Allow any origin during local development to avoid LAN/host mismatch issues.
      if (!isProduction) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  void next;
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Protected routes
app.use('/api/purchase-requests', authMiddleware, purchaseRequestRoutes);
app.use('/api/price-submissions', authMiddleware, priceSubmissionRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
