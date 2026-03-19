import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/init.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// Create purchase request (farmers only)
router.post('/', authMiddleware, requireRole('farmer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, quantity, fulfillment_type, delivery_location, phone } = req.body;

    if (!product_id || !quantity || !fulfillment_type || !phone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = await getDatabase();

    // Get product details to get seller_id
    const product = await db.get('SELECT seller_id FROM products WHERE id = ?', product_id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Create purchase request
    const result = await db.run(
      `INSERT INTO purchase_requests (buyer_id, product_id, seller_id, quantity, fulfillment_type, delivery_location, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user!.id, product_id, product.seller_id, quantity, fulfillment_type, delivery_location, phone]
    );

    res.status(201).json({ id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List purchase requests for current user
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const params: any[] = [];

    let query = `
      SELECT
        pr.*,
        p.name as product_name,
        p.price,
        seller.full_name as seller_name,
        buyer.full_name as buyer_name
      FROM purchase_requests pr
      JOIN products p ON pr.product_id = p.id
      JOIN users seller ON pr.seller_id = seller.id
      JOIN users buyer ON pr.buyer_id = buyer.id
      WHERE 1=1
    `;

    // Farmers see their own requests, suppliers see requests for their products
    if (req.user!.role === 'farmer') {
      query += ' AND pr.buyer_id = ?';
      params.push(req.user!.id);
    } else if (req.user!.role === 'agrodealer') {
      query += ' AND pr.seller_id = ?';
      params.push(req.user!.id);
    }

    query += ' ORDER BY pr.created_at DESC';

    const requests = await db.all(query, params);
    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update purchase request status (suppliers only)
router.put('/:id', authMiddleware, requireRole('agrodealer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const db = await getDatabase();

    // Verify ownership
    const request = await db.get(
      'SELECT * FROM purchase_requests WHERE id = ? AND seller_id = ?',
      req.params.id,
      req.user!.id
    );

    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    await db.run(
      'UPDATE purchase_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
