const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const imagesPath = path.join(__dirname, 'images');

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath);
}

app.use('/images', express.static(imagesPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('API Herbolari Susana funcionant');
});

/* PRODUCTS */

app.get('/products', (req, res) => {
  db.all(
    `SELECT 
      products.*, 
      categories.name AS category_name,
      categories.slug AS category_slug
     FROM products
     LEFT JOIN categories ON products.category_id = categories.id`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Error obtenint productes:', err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

app.get('/products/category/:slug', (req, res) => {
  const slug = req.params.slug;

  const sql = `
    SELECT 
      products.*,
      categories.name AS category_name,
      categories.slug AS category_slug
    FROM products
    JOIN categories ON products.category_id = categories.id
    WHERE categories.slug = ?
  `;

  db.all(sql, [slug], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Error obtenint productes per categoria'
      });
    }

    res.json(rows);
  });
});

app.post('/products', upload.single('image'), (req, res) => {
  const {
    name,
    description,
    price,
    category_id,
    subcategory,
    stock,
    is_new,
    is_eco,
    is_vegan,
    is_gluten_free,
    is_best_seller
  } = req.body;

  const image = req.file ? req.file.filename : '';

  if (!name || price == null || !category_id) {
    return res.status(400).json({
      error: 'Falten camps obligatoris: name, price, category_id'
    });
  }

  db.run(
    `INSERT INTO products
    (
      name,
      description,
      price,
      image,
      category_id,
      subcategory,
      stock,
      is_new,
      is_eco,
      is_vegan,
      is_gluten_free,
      is_best_seller
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? )`,
    [
      name,
      description || '',
      price,
      image,
      category_id,
      subcategory || '',
      Number(stock) || 0,
      Number(is_new) || 0,
      Number(is_eco) || 0,
      Number(is_vegan) || 0,
      Number(is_gluten_free) || 0,
      Number(is_best_seller) || 0
    ],
    function (err) {
      if (err) {
        console.error('Error creant producte:', err.message);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Producte creat correctament',
        productId: this.lastID
      });
    }
  );
});

app.put('/products/:id', upload.single('image'), (req, res) => {
  const {
    name,
    description,
    price,
    category_id,
    subcategory,
    stock,
    is_new,
    is_eco,
    is_vegan,
    is_gluten_free,
    is_best_seller,
    currentImage
  } = req.body;

  const image = req.file ? req.file.filename : currentImage;

  if (!name || price == null || !category_id) {
    return res.status(400).json({
      error: 'Falten camps obligatoris: name, price, category_id'
    });
  }

  db.run(
    `UPDATE products
     SET name = ?,
         description = ?,
         price = ?,
         image = ?,
         category_id = ?,
         subcategory = ?,
         stock = ?,
         is_new = ?,
         is_eco = ?,
         is_vegan = ?,
         is_gluten_free = ?,
         is_best_seller = ?
     WHERE id = ?`,
    [
      name,
      description || '',
      price,
      image || '',
      category_id,
      subcategory || '',
      Number(stock) || 0,
      Number(is_new) || 0,
      Number(is_eco) || 0,
      Number(is_vegan) || 0,
      Number(is_gluten_free) || 0,
      Number(is_best_seller) || 0,
      req.params.id
    ],
    function (err) {
      if (err) {
        console.error('Error actualitzant producte:', err.message);
        return res.status(500).json({
          error: 'Error actualitzant producte'
        });
      }

      res.json({
        message: 'Producte actualitzat correctament'
      });
    }
  );
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error eliminant producte:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: 'Producte eliminat correctament'
    });
  });
});

/* CATEGORIES */

app.get('/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) {
      console.error('Error obtenint categories:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

/* USERS */

app.get('/users', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error obtenint usuaris:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Falten dades: name, email o password'
    });
  }

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    function (err) {
      if (err) {
        console.error('Error registrant usuari:', err.message);

        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({
            error: 'Aquest email ja està registrat'
          });
        }

        return res.status(500).json({ error: err.message });
      }

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
    return res.status(400).json({
      error: 'Els camps email i password són obligatoris'
    });
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
        return res.status(401).json({
          message: 'Email o contrasenya incorrectes'
        });
      }

      res.json({
        message: 'Login correcte',
        user
      });
    }
  );
});
/* ORDERS */
app.get('/orders', (req, res) => {
  const sql = `
    SELECT 
      orders.*,
      users.name AS user_name,
      users.email AS user_email,
      order_details.product_id,
      order_details.quantity,
      order_details.unit_price,
      products.name AS product_name,
      products.image AS product_image
    FROM orders
    LEFT JOIN users ON orders.user_id = users.id
    LEFT JOIN order_details ON orders.id = order_details.order_id
    LEFT JOIN products ON order_details.product_id = products.id
    ORDER BY orders.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error obtenint totes les comandes:', err.message);
      return res.status(500).json({
        error: 'Error obtenint totes les comandes'
      });
    }

    res.json(rows);
  });
});

app.get('/orders/user/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      orders.*,
      order_details.product_id,
      order_details.quantity,
      order_details.unit_price,
      products.name AS product_name,
      products.image AS product_image
    FROM orders
    LEFT JOIN order_details ON orders.id = order_details.order_id
    LEFT JOIN products ON order_details.product_id = products.id
    WHERE orders.user_id = ?
    ORDER BY orders.created_at DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error obtenint comandes:', err.message);
      return res.status(500).json({
        error: 'Error obtenint les comandes'
      });
    }

    res.json(rows);
  });
});


app.post('/orders', (req, res) => {
  const { user_id, items, total, status, delivery_type } = req.body || {};

  if (
    !user_id ||
    !items ||
    items.length === 0 ||
    total == null ||
    !status ||
    !delivery_type
  ) {
    return res.status(400).json({
      error: 'Falten camps obligatoris'
    });
  }

  const insertOrderSql = `
    INSERT INTO orders (user_id, total, status, delivery_type)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    insertOrderSql,
    [user_id, total, status, delivery_type],
    function (err) {
      if (err) {
        console.error('Error creant comanda:', err.message);
        return res.status(500).json({
          error: 'Error creant la comanda'
        });
      }

      const orderId = this.lastID;

      const insertDetailSql = `
        INSERT INTO order_details
        (order_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `;

      const stmt = db.prepare(insertDetailSql);

      items.forEach((item) => {
        stmt.run(
          orderId,
          item.id,
          item.quantity || 1,
          item.price
        );
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error guardant detalls:', err.message);
          return res.status(500).json({
            error: 'Error guardant els productes de la comanda'
          });
        }

        res.status(201).json({
          message: 'Comanda creada correctament',
          orderId
        });
      });
    }
  );
});
app.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  const sql = `
    SELECT 
      orders.*,
      users.name AS user_name,
      users.email AS user_email,
      order_details.product_id,
      order_details.quantity,
      order_details.unit_price,
      products.name AS product_name,
      products.image AS product_image
    FROM orders
    LEFT JOIN users ON orders.user_id = users.id
    LEFT JOIN order_details ON orders.id = order_details.order_id
    LEFT JOIN products ON order_details.product_id = products.id
    WHERE orders.id = ?
  `;

  db.all(sql, [orderId], (err, rows) => {
    if (err) {
      console.error('Error obtenint la comanda:', err.message);
      return res.status(500).json({
        error: 'Error obtenint la comanda'
      });
    }

    res.json(rows);
  });
});
app.put('/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Falta l’estat de la comanda' });
  }

  const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, orderId], function (err) {
    if (err) {
      console.error('Error actualitzant estat:', err.message);
      return res.status(500).json({
        error: 'Error actualitzant la comanda'
      });
    }

    res.json({
      message: 'Comanda actualitzada correctament'
    });
  });
});
app.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  db.run('DELETE FROM order_details WHERE order_id = ?', [orderId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error eliminant detalls de la comanda' });
    }

    db.run('DELETE FROM orders WHERE id = ?', [orderId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error eliminant comanda' });
      }

      res.json({ message: 'Comanda eliminada correctament' });
    });
  });
});

/* SERVER */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend escoltant en http://localhost:${PORT}`);
});