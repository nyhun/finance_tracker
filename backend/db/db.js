const Database = require('better-sqlite3');

// Custom random function with fixed seed (adapted from: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript)
// It's not uniformly distributed, but for this exercise will do
// Needed because Math doesn't have a built in way to fix the seed (which we need for consistency)
let seed = 1;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function initDB() {
  console.log("Setting up DB connection...");
  const db = new Database('./db/database.sqlite');

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
      console.log('Adding dummy records...');

      const insert = db.prepare(`
        INSERT INTO transactions (type, amount, category, date)
        VALUES (?, ?, ?, ?)
      `);

      for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 5; j++) {
          const type = j % 2 === 0 ? 'income' : 'expense';
          const amount = parseFloat(random().toFixed(2));
          const category = 'salary';
          const date = `2025-01-${i.toString().padStart(2, '0')}`;
          insert.run(type, amount, category, date);
        }
      }
    }
  });

  init();

  return db;
}

module.exports = { initDB };