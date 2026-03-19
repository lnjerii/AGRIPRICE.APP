import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../db/init.js';
import { generateToken } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Signup Route
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, role, phone, county, sub_location, shop_name, shop_location } = req.body;

    if (!email || !password || !full_name || !role) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = await getDatabase();

    // Check if user exists
    const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.run(
      `INSERT INTO users (email, password_hash, full_name, role, phone, county, sub_location, shop_name, shop_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, passwordHash, full_name, role, phone, county, sub_location, shop_name, shop_location]
    );

    const token = generateToken({ id: result.lastID!, email, role });

    res.status(201).json({
      user: { id: result.lastID, email, full_name, role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const db = await getDatabase();
    const user = await db.get('SELECT id, email, full_name, role FROM users WHERE id = ?', req.user.id);

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
