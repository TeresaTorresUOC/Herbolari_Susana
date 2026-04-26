const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.send('API Herbolari Susana funcionant');
});

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.error('Errors obtenint productes:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Falten dades: name, email o password' });
  }

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    function (err) {
      if (err) {
        console.error('Error registrant usuari:', err.message);

        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Aquest email ja està registrat' });
        }

        return res.status(500).json({ error: err.message });
      }

      console.log('Usuari registrat amb ID:', this.lastID);

      res.status(201).json({
        message: 'Usuari registrat correctament',
        userId: this.lastID
      });
    }
  );
});

app.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Els camps email i password són obligatoris' });
  }

  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, user) => {
      if (err) {
        console.error('Error en login:', err.message);
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ message: 'Email o contrasenya incorrectes' });
      }

      res.json({ message: 'Login correcte', user });
    }
  );
});

app.post('/orders', (req, res) => {
  const { user_id, items, total, status, delivery_type } = req.body || {};

  if (!user_id || !items || items.length === 0 || total == null || !status || !delivery_type) {
    return res.status(400).json({
      error: 'Falten camps obligatoris: user_id, items, total, status, delivery_type'
    });
  }

  db.run(
    'INSERT INTO orders (user_id, total, status, delivery_type) VALUES (?, ?, ?, ?)',
    [user_id, total, status, delivery_type],
    function (err) {
      if (err) {
        console.error('Error creant comanda:', err.message);
        return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      const stmt = db.prepare(
        'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
      );

      items.forEach((item) => {
        stmt.run(orderId, item.id, 1, item.price);
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error guardant detalls:', err.message);
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: 'Comanda creada correctament',
          orderId: orderId
        });
      });
    }
  );
});

app.get('/users', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error obtenint usuaris:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escoltant en http://localhost:${PORT}`);
});