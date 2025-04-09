// models/db.js
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

// users table
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

//events table
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

// SQL statement to create the "rsvps" table
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

const addColumnSql = `ALTER TABLE users
ADD COLUMN residence TEXT 
  CHECK(residence IN (
    'Alexander Hall',
    'Campbell College South',
    'Transitional Hall',
    'Campbell College North',
    'Dixon Hall',
    'University Place',
    'Stewart Hall',
    'Commuter'
  ))
  NOT NULL DEFAULT 'Commuter';
`;



db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists.');
    }
  });
  db.run(createEventsTable, (err) => {
    if (err) {
      console.error('Error creating events table:', err.message);
    } else {
      console.log('Events table created or already exists.');
    }
  });
  db.run(createRSVPsTable, (err) => {
    if (err) {
      console.error('Error creating rsvps table:', err.message);
    } else {
      console.log('RSVPs table created or already exists.');
    }
  });

  db.run(addColumnSql, (err) => {
    if (err) {
      console.error('Error adding column:', err.message);
    } else {
      console.log('Column "residence" added successfully.');
    }
  });
});

// Close the database connection

module.exports = db;
