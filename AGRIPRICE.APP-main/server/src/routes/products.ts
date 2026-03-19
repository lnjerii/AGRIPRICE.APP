import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/init.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// Search products (public)
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category } = req.query;
    const db = await getDatabase();

    let query = `
      SELECT
        p.*,
        u.full_name AS seller_name,
        u.shop_name AS shop_name,
        u.shop_location AS shop_location
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (q) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR u.full_name LIKE ? OR u.shop_name LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    query += ' ORDER BY p.created_at DESC';

    const products = await db.all(query, params);
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID (public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const product = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List user's products (agrodealers only)
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const products = await db.all('SELECT * FROM products WHERE seller_id = ?', req.user!.id);
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (agrodealers only)
router.post('/', authMiddleware, requireRole('agrodealer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, stock, description, image_url, location } = req.body;

    if (!name || !category || price === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = await getDatabase();
    const result = await db.run(
      `INSERT INTO products (seller_id, name, category, price, stock, description, image_url, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user!.id, name, category, price, stock || 0, description, image_url, location]
    );

    res.status(201).json({ id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product (agrodealers only)
router.put('/:id', authMiddleware, requireRole('agrodealer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const product = await db.get('SELECT * FROM products WHERE id = ? AND seller_id = ?', req.params.id, req.user!.id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const { name, category, price, stock, description } = req.body;
    await db.run(
      'UPDATE products SET name=?, category=?, price=?, stock=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [name || product.name, category || product.category, price, stock, description, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product (agrodealers only)
router.delete('/:id', authMiddleware, requireRole('agrodealer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const product = await db.get('SELECT * FROM products WHERE id = ? AND seller_id = ?', req.params.id, req.user!.id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await db.run('DELETE FROM products WHERE id = ?', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
