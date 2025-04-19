// controllers/events.controller.js
const db = require('../models/db');

exports.createEvent = (req, res, next) => {
  const organizerId = req.user.id;  // set by authenticateToken
  const { title, description, location, date } = req.body;

  // Basic validation
  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required.' });
  }

  const sql = `
    INSERT INTO events (title, description, location, date, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [title, description, location, date, organizerId];

  db.run(sql, params, function(err) {
    if (err) {
      return next(err);
    }
    res.status(201).json({
      message: 'Event created successfully!',
      eventId: this.lastID
    });
  });
};
