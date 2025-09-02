const Database = require('better-sqlite3');

const db = new Database('./db/database.sqlite');
console.log("Connected to DB");

function initDB(db) {
  const init = db.transaction(() => {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `).run();

    const count = db.prepare(`SELECT COUNT(*) AS count FROM transactions`).get().count;

    if (count === 0) {
      console.log('Initializing with dummy records...');

      const insert = db.prepare(`
        INSERT INTO transactions (type, amount, category, date)
        VALUES (?, ?, ?, ?)
      `);

      for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 10; j++) {
          const type = j % 2 === 0 ? 'income' : 'expense';
          const amount = parseFloat((Math.random() * 1000).toFixed(2));
          const category = Math.random() < 0.5 ? 'salary' : 'groceries';
          const date = `2025-${i.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
          insert.run(type, amount, category, date);
        }
      }
    }
  });

  init();
}

function insertTransaction({ type, amount, category, date }) {
  const stmt = db.prepare(`
    INSERT INTO transactions (type, amount, category, date)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(type, amount, category, date);
  return result.lastInsertRowid;
}

function updateTransactionById(id, { type, amount, category, date }) {
  const stmt = db.prepare(`
    UPDATE transactions
    SET type = ?, amount = ?, category = ?, date = ?
    WHERE id = ?
  `);
  const result = stmt.run(type, amount, category, date, id);
  return result.changes > 0;
}

function deleteTransactionById(id) {
  const stmt = db.prepare(`DELETE FROM transactions WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

function getTransactionsInDateRange({ startDate, endDate, category }) {
  const params = [startDate, endDate];
  let filter = '';

  if (category) {
    filter = ' AND category = ?';
    params.push(category);
  }

  const stmt = db.prepare(
    `SELECT * FROM transactions WHERE date BETWEEN ? AND ?${filter}`
  );
  return stmt.all(...params);
}

function getTransactionsWithFilters({ category, from, to, offset, limit }) {
  let query = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (from) {
    query += ' AND date >= ?';
    params.push(from);
  }
  if (to) {
    query += ' AND date <= ?';
    params.push(to);
  }

  if (limit) {
    query += ' LIMIT ? ';
    params.push(limit);
  }
  if (offset) {
    query += ' OFFSET ? ';
    params.push(offset);
  }

  return db.prepare(query).all(...params);
}

module.exports = {
  db,
  initDB,
  insertTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionsInDateRange,
  getTransactionsWithFilters,
};