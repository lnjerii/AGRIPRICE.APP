import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', 'agri_price.db');

let db: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
  if (db) return db;

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT CHECK(role IN ('farmer', 'agrodealer', 'market_officer', 'admin')) NOT NULL,
      phone TEXT,
      county TEXT,
      sub_location TEXT,
      shop_name TEXT,
      shop_location TEXT,
      shop_gps TEXT,
      market_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT CHECK(category IN ('Seeds', 'Fertilizers', 'Chemicals', 'Tools')) NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER DEFAULT 0,
      description TEXT,
      image_url TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS purchase_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      fulfillment_type TEXT CHECK(fulfillment_type IN ('pickup', 'delivery')) NOT NULL,
      delivery_location TEXT,
      phone TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'accepted', 'rejected', 'completed')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS price_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      officer_id INTEGER NOT NULL,
      commodity TEXT NOT NULL,
      market TEXT NOT NULL,
      unit TEXT DEFAULT 'kg',
      price INTEGER NOT NULL,
      submission_date DATE NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (officer_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id INTEGER,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK(type IN ('purchase', 'price_alert', 'system')),
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
    CREATE INDEX IF NOT EXISTS idx_purchase_requests_buyer ON purchase_requests(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_purchase_requests_seller ON purchase_requests(seller_id);
    CREATE INDEX IF NOT EXISTS idx_price_submissions_officer ON price_submissions(officer_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  `);

  // Seed test data
  const users = await db.all('SELECT COUNT(*) as count FROM users');
  if (users[0].count === 0) {
    const testUsers = [
      {
        email: 'farmer@test.com',
        password: 'password123',
        full_name: 'John Farmer',
        role: 'farmer',
        phone: '0712345678',
        county: 'Kiambu',
        sub_location: 'Thika'
      },
      {
        email: 'dealer@test.com',
        password: 'password123',
        full_name: 'Ahmed Dealer',
        role: 'agrodealer',
        phone: '0723456789',
        shop_name: 'Ahmed Agro Shop',
        shop_location: 'Nairobi'
      },
      {
        email: 'officer@test.com',
        password: 'password123',
        full_name: 'Grace Officer',
        role: 'market_officer',
        phone: '0734567890',
        market_name: 'Central Market'
      },
      {
        email: 'admin@test.com',
        password: 'password123',
        full_name: 'Admin User',
        role: 'admin',
        phone: '0745678901'
      }
    ];

    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await db.run(
        `INSERT INTO users (email, password_hash, full_name, role, phone, county, sub_location, shop_name, shop_location, market_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.email,
          passwordHash,
          user.full_name,
          user.role,
          user.phone,
          (user as any).county || null,
          (user as any).sub_location || null,
          (user as any).shop_name || null,
          (user as any).shop_location || null,
          (user as any).market_name || null
        ]
      );
    }

    console.log('✓ Seed data created');
  }

  console.log('✓ Database initialized');
  return db;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
