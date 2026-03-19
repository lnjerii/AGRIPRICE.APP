import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/init.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// List price submissions for current user/admin
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const { status } = req.query;

    if (req.user!.role === 'market_officer') {
      const submissions = await db.all(
        'SELECT * FROM price_submissions WHERE officer_id = ? ORDER BY created_at DESC',
        req.user!.id
      );
      res.json({ submissions });
      return;
    }

    if (req.user!.role === 'admin') {
      let query = `
        SELECT ps.*, u.full_name as officer_name
        FROM price_submissions ps
        JOIN users u ON ps.officer_id = u.id
      `;
      const params: any[] = [];

      if (status) {
        query += ' WHERE ps.status = ?';
        params.push(status);
      }

      query += ' ORDER BY ps.created_at DESC';

      const submissions = await db.all(query, params);
      res.json({ submissions });
      return;
    }

    res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit price (market officers only)
router.post('/', authMiddleware, requireRole('market_officer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { commodity, market, unit, price, submission_date } = req.body;

    if (!commodity || !market || !unit || price === undefined || !submission_date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = await getDatabase();
    const result = await db.run(
      `INSERT INTO price_submissions (officer_id, commodity, market, unit, price, submission_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user!.id, commodity, market, unit, price, submission_date]
    );

    res.status(201).json({ id: result.lastID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List price submissions for officer
router.get('/officer/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const submissions = await db.all(
      'SELECT * FROM price_submissions WHERE officer_id = ? ORDER BY created_at DESC',
      req.params.id
    );
    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all pending submissions (admin only)
router.get('/pending', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const submissions = await db.all(
      `SELECT ps.*, u.full_name as officer_name
       FROM price_submissions ps
       JOIN users u ON ps.officer_id = u.id
       WHERE ps.status = 'pending'
       ORDER BY ps.created_at DESC`
    );
    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/reject submission (admin only)
router.put('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, admin_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const db = await getDatabase();
    await db.run(
      'UPDATE price_submissions SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, admin_notes, req.params.id]
    );

    // Log admin action
    await db.run(
      `INSERT INTO admin_logs (admin_id, action, resource_type, resource_id, details)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user!.id, `price_submission_${status}`, 'price_submission', req.params.id, admin_notes]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get market prices (farmers only)
router.get('/market/:market', authMiddleware, requireRole('farmer'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const prices = await db.all(
      `SELECT DISTINCT commodity, market, unit, price, submission_date
       FROM price_submissions
       WHERE market = ? AND status = 'approved'
       ORDER BY submission_date DESC`,
      req.params.market
    );
    res.json({ prices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
