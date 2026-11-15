const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

function openDatabase(filename = path.join(__dirname, 'portal.sqlite')) {
  const db = new DatabaseSync(filename);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, name TEXT);
    CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, author TEXT, body TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY, display_name TEXT);
  `);
  // Plaintext credentials are dummy fixture data for this isolated SQL lesson,
  // not an example of production password storage.
  db.prepare('INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?)').run(1, 'student', 'campus123', 'Aarav Sharma');
  db.prepare('INSERT OR IGNORE INTO profile VALUES (?, ?)').run(1, 'Aarav Sharma');
  return db;
}

function resetDatabase(db) {
  db.exec('DELETE FROM comments');
  db.prepare('UPDATE profile SET display_name = ? WHERE id = 1').run('Aarav Sharma');
}
module.exports = { openDatabase, resetDatabase };
