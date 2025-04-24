const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to your SQLite database file
const dbPath = path.resolve(__dirname, 'sensai.db');

// Open a connection to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Enable foreign key constraints
    db.run('PRAGMA foreign_keys = ON;');
  }
});

// Core tables
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    student_id TEXT UNIQUE,
    major TEXT,
    classification TEXT,
    role TEXT CHECK(role IN ('student', 'organizer', 'admin')) NOT NULL,
    residence TEXT CHECK(residence IN (
      'Alexander Hall',
      'Campbell College South',
      'Transitional Hall',
      'Campbell College North',
      'Dixon Hall',
      'University Place',
      'Stewart Hall',
      'Commuter'
    )) NOT NULL DEFAULT 'Commuter',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

const createEventsTable = `
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date DATETIME,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
  );
`;

const createRSVPsTable = `
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER,
    status TEXT CHECK(status IN ('going', 'maybe', 'not going')) DEFAULT 'going',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );
`;

// Tagging schema: categories, interests, join tables
const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );
`;

const createInterestsTable = `
  CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(category_id, name),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`;

const createUserInterestsTable = `
  CREATE TABLE IF NOT EXISTS user_interests (
    user_id INTEGER NOT NULL,
    interest_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
  );
`;

const createEventInterestsTable = `
  CREATE TABLE IF NOT EXISTS event_interests (
    event_id INTEGER NOT NULL,
    interest_id INTEGER NOT NULL,
    PRIMARY KEY (event_id, interest_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
  );
`;

// Seed data for categories and interests
const categories = ['Social','Career','Cultural','Sports','Academic'];
const interestMapping = {
  Social: ['Student Organization Events','Greek Life Events','Campus Parties', 'Movie Nights', 'Game Nights'],
  Career: ['Job Fairs','Networking Events','Resume Workshops','Internship Opportunities', 'Career Counseling'],
  Cultural: ['Art Exhibits','Music Events','Dance Performances', 'Theater Productions', 'Cultural Festivals'],
  Sports: ['Intramural Sports','Football Games','Basketball Games', 'Baseball Gammes', 'Track and Field'],
  Academic: ['Research Opportunities','Tutoring Services','Honors Programs','Academic Workshops', 'Study Groups']
};

// Apply schema and seed
db.serialize(() => {
  // Core tables
  db.run(createUsersTable);
  db.run(createEventsTable);
  db.run(
    `ALTER TABLE events
       ADD COLUMN status TEXT
         CHECK(status IN ('pending','approved','rejected'))
         NOT NULL
         DEFAULT 'pending';`,
    err => {
      if (err && !/duplicate column name: status/.test(err.message)) {
        console.error('Error adding status column to events:', err.message);
      }
    }
  );
  db.run(createRSVPsTable);

  // Tagging tables
  db.run(createCategoriesTable);
  db.run(createInterestsTable);
  db.run(createUserInterestsTable);
  db.run(createEventInterestsTable);

  // Seed categories
  const catStmt = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?);`);
  categories.forEach(cat => catStmt.run(cat));
  catStmt.finalize();

  // Seed interests under each category
  Object.entries(interestMapping).forEach(([catName, interests]) => {
    db.get(`SELECT id FROM categories WHERE name = ?;`, [catName], (err, row) => {
      if (!err && row) {
        const intStmt = db.prepare(
          `INSERT OR IGNORE INTO interests (category_id, name) VALUES (?, ?);`
        );
        interests.forEach(interest => intStmt.run(row.id, interest));
        intStmt.finalize();
      }
    });
  });
});

// Export the open database for use in your app
module.exports = db;

