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
      name TEXT NOT NULL
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
    INSERT OR IGNORE INTO categories (id, name) VALUES
    (1, 'Fitoteràpia'),
    (2, 'Alimentació'),
    (3, 'Cosmètica')
  `);

  db.run(`
    INSERT OR IGNORE INTO products (id, name, description, price, image, category_id) VALUES
    (1, 'Infusió relaxant', 'Infusió natural per al descans', 5.95, 'infusio.jpg', 1),
    (2, 'Vitamina C', 'Complement alimentari', 12.50, 'vitaminac.jpg', 2),
    (3, 'Crema hidratant', 'Crema natural facial', 9.99, 'crema.jpg', 3)
  `);
});

module.exports = db;