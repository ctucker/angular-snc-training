const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'bookmarks_app.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const initDb = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        displayName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else console.log('Users table checked/created.');
    });

    // Authenticators table
    db.run(`
      CREATE TABLE IF NOT EXISTS authenticators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        provider TEXT NOT NULL,
        providerId TEXT NOT NULL,
        displayName TEXT,
        username TEXT, -- For Twitter or similar
        email TEXT, -- Email from provider, if available
        accessToken TEXT,
        refreshToken TEXT,
        scopes TEXT, -- Store scopes as JSON string or comma-separated
        profileJson TEXT, -- Store full profile from provider as JSON string
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (userId, provider),
        UNIQUE (provider, providerId)
      )
    `, (err) => {
      if (err) console.error('Error creating authenticators table:', err.message);
      else console.log('Authenticators table checked/created.');
    });

    // Bookmarks table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        authenticatorId INTEGER, -- Can be null if bookmark is manually added or not tied to a specific provider session
        provider TEXT, -- e.g., 'twitter', 'linkedin', 'manual'
        bookmarkData TEXT NOT NULL, -- JSON string containing URL, title, tags, notes, etc.
        savedAtProvider DATETIME, -- If the bookmark was saved via a provider API, when it was saved there
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (authenticatorId) REFERENCES authenticators(id) ON DELETE SET NULL
      )
    `, (err) => {
      if (err) console.error('Error creating bookmarks table:', err.message);
      else console.log('Bookmarks table checked/created.');
    });

    // Triggers for updatedAt
    const tablesWithUpdatedAt = ['users', 'authenticators', 'bookmarks'];
    tablesWithUpdatedAt.forEach(tableName => {
      db.run(`
        CREATE TRIGGER IF NOT EXISTS set_${tableName}_updated_at
        AFTER UPDATE ON ${tableName}
        FOR EACH ROW
        BEGIN
          UPDATE ${tableName}
          SET updatedAt = CURRENT_TIMESTAMP
          WHERE id = OLD.id;
        END;
      `, (err) => {
        if (err) console.error(`Error creating updatedAt trigger for ${tableName}:`, err.message);
        else console.log(`UpdatedAt trigger for ${tableName} checked/created.`);
      });
    });

  });
};

// Initialize DB when module is loaded
initDb();

module.exports = { db, initDb };
