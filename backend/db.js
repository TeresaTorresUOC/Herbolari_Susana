const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error obrint la base de dades:', err.message);
  } else {
    console.log('Connectada a SQLite');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'client'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,

    category_id INTEGER,
    subcategory TEXT,
    stock INTEGER DEFAULT 0,

    is_new INTEGER DEFAULT 0,
    is_eco INTEGER DEFAULT 0,
    is_vegan INTEGER DEFAULT 0,
    is_gluten_free INTEGER DEFAULT 0,
    is_best_seller INTEGER DEFAULT 0,

    FOREIGN KEY (category_id) REFERENCES categories(id)
  )
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total REAL,
      status TEXT,
      delivery_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      unit_price REAL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES
    (1, 'Teresa', 'teresa@test.com', '1234', 'admin')
  `);

  db.run(`
  INSERT OR IGNORE INTO categories (id, name, slug) VALUES
  (1, 'Fitoteràpies', 'fitoterapia'),
  (2, 'Alimentació', 'alimentacio'),
  (3, 'Cosmètica', 'cosmetica'),
  (4, 'Llar', 'llar'),
  (5, 'Mascotes', 'mascotes')
`);

db.run(`
INSERT OR IGNORE INTO products 
(id, name, description, price, image, category_id, subcategory, stock, is_new, is_eco, is_vegan, is_gluten_free, is_best_seller) VALUES
(1, 'Infusió relaxant', 'Infusió natural per al descans', 5.95, 'infusio.jpg', 1, 'infusions', 10, 1, 1, 1, 0, 1),
(2, 'Vitamina C', 'Complement alimentari', 12.50, 'vitaminac.jpg', 1, 'vitamines', 8, 1, 0, 1, 1, 1),
(3, 'Crema hidratant', 'Crema natural facial', 9.99, 'crema.jpg', 3, 'facial', 6, 1, 1, 1, 0, 0),
(4, 'Farina ecològica', 'Farina natural ecològica', 20.00, 'farina.webp', 2, 'farines', 12, 1, 1, 1, 0, 1),
(5, 'Beguda vegetal', 'Beguda vegetal natural', 3.50, 'beguda.webp', 2, 'begudes', 15, 1, 1, 1, 0, 0)
`);
});

module.exports = db;