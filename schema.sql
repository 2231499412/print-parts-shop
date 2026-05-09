DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  image_data TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '面议',
  spec TEXT NOT NULL DEFAULT '',
  desc TEXT NOT NULL DEFAULT '',
  hot INTEGER NOT NULL DEFAULT 0,
  variants TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now', '+8 hours')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', '+8 hours'))
);
