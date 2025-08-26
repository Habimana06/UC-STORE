import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'ucstore.db');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

sqlite3.verbose();
const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) reject(err);
			else resolve(this);
		});
	});
}

function all(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
}

async function init() {
	await run(`CREATE TABLE IF NOT EXISTS products (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		category TEXT,
		supplier TEXT,
		stock INTEGER NOT NULL DEFAULT 0,
		price REAL NOT NULL DEFAULT 0,
		minStock INTEGER NOT NULL DEFAULT 10,
		createdAt TEXT,
		updatedAt TEXT
	)`);

	await run(`CREATE TABLE IF NOT EXISTS sales (
		id TEXT PRIMARY KEY,
		productId TEXT NOT NULL,
		qty INTEGER NOT NULL,
		price REAL NOT NULL,
		total REAL NOT NULL,
		customerName TEXT,
		date TEXT NOT NULL,
		FOREIGN KEY(productId) REFERENCES products(id)
	)`);

	await run(`CREATE TABLE IF NOT EXISTS purchases (
		id TEXT PRIMARY KEY,
		productId TEXT NOT NULL,
		qty INTEGER NOT NULL,
		cost REAL NOT NULL,
		total REAL NOT NULL,
		supplierName TEXT,
		date TEXT NOT NULL,
		FOREIGN KEY(productId) REFERENCES products(id)
	)`);

	await run(`CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		username TEXT,
		role TEXT,
		email TEXT,
		avatarUrl TEXT,
		department TEXT,
		location TEXT,
		joinDate TEXT,
		updatedAt TEXT
	)`);

	const count = await all('SELECT COUNT(*) as c FROM products');
	if (count[0]?.c === 0) {
		const seed = [
			{ id: 'P-1001', name: 'USB-C Cable', category: 'Accessories', supplier: 'TechSupply', stock: 120, price: 5.99, minStock: 20 },
			{ id: 'P-1002', name: 'Wireless Mouse', category: 'Peripherals', supplier: 'ClickCo', stock: 48, price: 19.99, minStock: 10 },
			{ id: 'P-1003', name: 'Mechanical Keyboard', category: 'Peripherals', supplier: 'KeyWorks', stock: 22, price: 79.0, minStock: 5 },
			{ id: 'P-1004', name: '27" Monitor', category: 'Displays', supplier: 'ViewWorld', stock: 10, price: 199.99, minStock: 3 },
		];
		for (const p of seed) {
			await run(
				`INSERT INTO products (id, name, category, supplier, stock, price, minStock, createdAt) VALUES (?,?,?,?,?,?,?,?)`,
				[p.id, p.name, p.category, p.supplier, p.stock, p.price, p.minStock, new Date().toISOString()]
			);
		}
	}
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

const PORT = process.env.PORT || 3001;

// Helpers
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// Multer setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Products
app.get('/api/products', async (req, res) => {
	try {
		const rows = await all('SELECT * FROM products ORDER BY createdAt ASC');
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/products', async (req, res) => {
	try {
		const { id, name, category, supplier, stock = 0, price = 0, minStock = 10 } = req.body;
		const productId = id || generateId('P');
		await run(
			`INSERT INTO products (id, name, category, supplier, stock, price, minStock, createdAt) VALUES (?,?,?,?,?,?,?,?)`,
			[productId, name, category, supplier, Number(stock), Number(price), Number(minStock), new Date().toISOString()]
		);
		const [product] = await all('SELECT * FROM products WHERE id=?', [productId]);
		res.status(201).json(product);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/products/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { name, category, supplier, stock, price, minStock } = req.body;
		await run(
			`UPDATE products SET name=?, category=?, supplier=?, stock=?, price=?, minStock=?, updatedAt=? WHERE id=?`,
			[name, category, supplier, Number(stock), Number(price), Number(minStock), new Date().toISOString(), id]
		);
		const [product] = await all('SELECT * FROM products WHERE id=?', [id]);
		res.json(product);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/products/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await run('DELETE FROM products WHERE id=?', [id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Sales
app.get('/api/sales', async (req, res) => {
	try {
		const rows = await all('SELECT * FROM sales ORDER BY date DESC');
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/sales', async (req, res) => {
	try {
		const { productId, qty, price, customerName = 'Walk-in' } = req.body;
		const [product] = await all('SELECT * FROM products WHERE id=?', [productId]);
		if (!product) return res.status(400).json({ error: 'Product not found' });
		if (qty > product.stock) return res.status(400).json({ error: `Insufficient stock. Available: ${product.stock}` });
		const total = Number((qty * price).toFixed(2));
		const saleId = generateId('S');
		await run('UPDATE products SET stock=? WHERE id=?', [Math.max(0, product.stock - qty), productId]);
		await run(
			`INSERT INTO sales (id, productId, qty, price, total, customerName, date) VALUES (?,?,?,?,?,?,?)`,
			[saleId, productId, Number(qty), Number(price), total, customerName, new Date().toISOString()]
		);
		const [updatedProduct] = await all('SELECT * FROM products WHERE id=?', [productId]);
		const [sale] = await all('SELECT * FROM sales WHERE id=?', [saleId]);
		res.status(201).json({ sale, product: updatedProduct });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Purchases
app.get('/api/purchases', async (req, res) => {
	try {
		const rows = await all('SELECT * FROM purchases ORDER BY date DESC');
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/purchases', async (req, res) => {
	try {
		const { productId, qty, cost, supplierName } = req.body;
		const [product] = await all('SELECT * FROM products WHERE id=?', [productId]);
		if (!product) return res.status(400).json({ error: 'Product not found' });
		const total = Number((qty * cost).toFixed(2));
		const purchaseId = generateId('PU');
		await run('UPDATE products SET stock=? WHERE id=?', [product.stock + Number(qty), productId]);
		await run(
			`INSERT INTO purchases (id, productId, qty, cost, total, supplierName, date) VALUES (?,?,?,?,?,?,?)`,
			[purchaseId, productId, Number(qty), Number(cost), total, supplierName || product.supplier, new Date().toISOString()]
		);
		const [updatedProduct] = await all('SELECT * FROM products WHERE id=?', [productId]);
		const [purchase] = await all('SELECT * FROM purchases WHERE id=?', [purchaseId]);
		res.status(201).json({ purchase, product: updatedProduct });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Stats endpoints (optional for charts)
app.get('/api/stats/summary', async (req, res) => {
	try {
		const [{ totalSales }] = await all('SELECT IFNULL(SUM(total),0) as totalSales FROM sales');
		const [{ totalPurchases }] = await all('SELECT IFNULL(SUM(total),0) as totalPurchases FROM purchases');
		const productsCount = (await all('SELECT COUNT(*) as c FROM products'))[0]?.c || 0;
		res.json({ totalSales, totalPurchases, productsCount });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Users
app.get('/api/users/:id', async (req, res) => {
  try {
    const [u] = await all('SELECT * FROM users WHERE id=?', [req.params.id]);
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const { id, username, role, email, avatarUrl = null, department = null, location = null, joinDate = null } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });
    const existing = await all('SELECT id FROM users WHERE id=?', [id]);
    if (existing.length) {
      await run(`UPDATE users SET username=?, role=?, email=?, avatarUrl=?, department=?, location=?, joinDate=?, updatedAt=? WHERE id=?`,
        [username, role, email, avatarUrl, department, location, joinDate, new Date().toISOString(), id]);
    } else {
      await run(`INSERT INTO users (id, username, role, email, avatarUrl, department, location, joinDate, updatedAt) VALUES (?,?,?,?,?,?,?,?,?)`,
        [id, username, role, email, avatarUrl, department, location, joinDate, new Date().toISOString()]);
    }
    const [u] = await all('SELECT * FROM users WHERE id=?', [id]);
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const fileUrl = `/uploads/${req.file.filename}`;
    await run('UPDATE users SET avatarUrl=?, updatedAt=? WHERE id=?', [fileUrl, new Date().toISOString(), req.params.id]);
    const [u] = await all('SELECT * FROM users WHERE id=?', [req.params.id]);
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

init().then(() => {
	app.listen(PORT, () => {
		console.log(`UC-STORE API running on http://localhost:${PORT}`);
	});
}).catch((e) => {
	console.error('Failed to initialize database', e);
	process.exit(1);
});
