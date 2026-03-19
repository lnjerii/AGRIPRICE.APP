import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/init.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// Get dashboard stats (admin only)
router.get('/dashboard/stats', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();

    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    const totalFarmers = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'farmer'");
    const totalDealers = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'agrodealers'");
    const pendingSubmissions = await db.get("SELECT COUNT(*) as count FROM price_submissions WHERE status = 'pending'");
    const pendingRequests = await db.get("SELECT COUNT(*) as count FROM purchase_requests WHERE status = 'pending'");

    res.json({
      stats: {
        totalUsers: totalUsers?.count || 0,
        totalFarmers: totalFarmers?.count || 0,
        totalDealers: totalDealers?.count || 0,
        pendingSubmissions: pendingSubmissions?.count || 0,
        pendingRequests: pendingRequests?.count || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all users (admin only)
router.get('/users', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const users = await db.all(
      'SELECT id, email, full_name, role, phone, county, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve agro-dealer (admin only - update user status/role)
router.put('/users/:id/approve', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    
    await db.run(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      req.params.id
    );

    // Log action
    await db.run(
      `INSERT INTO admin_logs (admin_id, action, resource_type, resource_id)
       VALUES (?, ?, ?, ?)`,
      [req.user!.id, 'user_approved', 'user', req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Suspend user (admin only)
router.put('/users/:id/suspend', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    const db = await getDatabase();

    // Log action and keep track of suspension
    await db.run(
      `INSERT INTO admin_logs (admin_id, action, resource_type, resource_id, details)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user!.id, 'user_suspended', 'user', req.params.id, reason]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system logs (admin only)
router.get('/logs', authMiddleware, requireRole('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDatabase();
    const logs = await db.all(
      `SELECT al.*, u.full_name as admin_name
       FROM admin_logs al
       JOIN users u ON al.admin_id = u.id
       ORDER BY al.created_at DESC
       LIMIT 100`
    );
    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
