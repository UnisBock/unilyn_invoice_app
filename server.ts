import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE,
    date TEXT,
    due_date TEXT,
    client_name TEXT,
    client_email TEXT,
    client_address TEXT,
    client_phone TEXT,
    items TEXT,
    tax_rate REAL,
    discount REAL,
    notes TEXT,
    subtotal REAL,
    total REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "admin123", "admin");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/users", (req, res) => {
    const { username, password, role } = req.body;
    try {
      db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(username, password, role || 'user');
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ success: false, message: "Username already exists" });
    }
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, username, role FROM users").all();
    res.json(users);
  });

  // Invoice Routes
  app.get("/api/invoices", (req, res: any) => {
    const invoices: any[] = db.prepare("SELECT * FROM invoices ORDER BY created_at DESC").all();
    res.json(invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      date: inv.date,
      dueDate: inv.due_date,
      client: {
        name: inv.client_name,
        email: inv.client_email,
        address: inv.client_address,
        phone: inv.client_phone
      },
      items: JSON.parse(inv.items),
      taxRate: inv.tax_rate,
      discount: inv.discount,
      notes: inv.notes,
      subtotal: inv.subtotal,
      total: inv.total,
      created_at: inv.created_at
    })));
  });

  app.post("/api/invoices", (req, res) => {
    const data = req.body;
    const subtotal = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    const discountAmount = (subtotal * data.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * data.taxRate) / 100;
    const total = subtotal - discountAmount + taxAmount;

    try {
      if (data.id) {
        db.prepare(`
          UPDATE invoices SET 
            invoice_number = ?, date = ?, due_date = ?, client_name = ?, client_email = ?, 
            client_address = ?, client_phone = ?, items = ?, tax_rate = ?, discount = ?, notes = ?, subtotal = ?, total = ?
          WHERE id = ?
        `).run(
          data.invoiceNumber, data.date, data.dueDate, data.client.name, data.client.email,
          data.client.address, data.client.phone, JSON.stringify(data.items), data.taxRate, data.discount, data.notes, subtotal, total,
          data.id
        );
      } else {
        db.prepare(`
          INSERT INTO invoices (
            invoice_number, date, due_date, client_name, client_email, 
            client_address, client_phone, items, tax_rate, discount, notes, subtotal, total
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          data.invoiceNumber, data.date, data.dueDate, data.client.name, data.client.email,
          data.client.address, data.client.phone, JSON.stringify(data.items), data.taxRate, data.discount, data.notes, subtotal, total
        );
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: "Invoice number already exists or database error" });
    }
  });

  app.get("/api/invoices/next-number", (req, res) => {
    const lastInvoice = db.prepare("SELECT invoice_number FROM invoices ORDER BY id DESC LIMIT 1").get();
    let nextNumber = `INV-${new Date().getFullYear()}-001`;
    
    if (lastInvoice) {
      const parts = lastInvoice.invoice_number.split('-');
      const lastSeq = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastSeq)) {
        nextNumber = `INV-${new Date().getFullYear()}-${String(lastSeq + 1).padStart(3, '0')}`;
      }
    }
    res.json({ nextNumber });
  });

  // Settings Routes
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, String(value));
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
