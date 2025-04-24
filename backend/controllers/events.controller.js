// controllers/events.controller.js
const db = require('../models/db');

exports.createEvent = (req, res, next) => {
  const organizerId = req.user.id;  // set by authenticateToken
  const {
    title,
    description,
    location,
    date,
    interestIds = []            // <-- expect an array of interest IDs
  } = req.body;

  // Basic validation
  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required.' });
  }

  // 1) Insert the core event record
  const sql = `
    INSERT INTO events (title, description, location, date, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [title, description, location, date, organizerId];

  db.run(sql, params, function(err) {
    if (err) return next(err);

    const eventId = this.lastID;

    // 2) If there are any interest tags, insert them
    if (Array.isArray(interestIds) && interestIds.length) {
      const stmt = db.prepare(`
        INSERT INTO event_interests (event_id, interest_id) 
        VALUES (?, ?)
      `);
      interestIds.forEach(iid => {
        stmt.run(eventId, iid);
      });
      stmt.finalize((linkErr) => {
        if (linkErr) return next(linkErr);
        // 3) Respond once both event + tags are created
        res.status(201).json({
          message: 'Event created and tagged successfully!',
          eventId
        });
      });
    } else {
      // No tags to link: respond immediately
      res.status(201).json({
        message: 'Event created successfully!',
        eventId
      });
    }
  });
};

exports.updateEvent = (req, res, next) => {
    const eventId = parseInt(req.params.id, 10);
    const user    = req.user; // set by authenticateToken
  
    // 1) Verify event exists and user is allowed to edit
    db.get(
      `SELECT created_by FROM events WHERE id = ?`,
      [eventId],
      (getErr, row) => {
        if (getErr) return next(getErr);
        if (!row) return res.status(404).json({ error: 'Event not found.' });
  
        // only the creator or an admin can update
        if (user.role !== 'admin' && row.created_by !== user.id) {
          return res.status(403).json({ error: 'Forbidden: cannot edit this event.' });
        }
  
        // 2) Extract updatable fields + tags
        const {
          title,
          description,
          location,
          date,
          interestIds   // array of new tag IDs
        } = req.body;
  
        // 3) Update core event fields
        const sqlUpdate = `
          UPDATE events
             SET title       = COALESCE(?, title),
                 description = COALESCE(?, description),
                 location    = COALESCE(?, location),
                 date        = COALESCE(?, date)
           WHERE id = ?
        `;
        const params = [title, description, location, date, eventId];
  
        db.run(sqlUpdate, params, function(updateErr) {
          if (updateErr) return next(updateErr);
  
          // 4) Retag interests if provided
          if (Array.isArray(interestIds)) {
            db.serialize(() => {
              // remove old tags
              db.run(
                `DELETE FROM event_interests WHERE event_id = ?`,
                [eventId]
              );
  
              // insert new tags
              const stmt = db.prepare(
                `INSERT INTO event_interests (event_id, interest_id) VALUES (?, ?)`
              );
              interestIds.forEach(iid => stmt.run(eventId, iid));
              stmt.finalize();
            });
          }
  
          // 5) Fetch and return the updated event + tags
          const sqlFetch = `
            SELECT e.id, e.title, e.description, e.location, e.date,
                   e.created_by, e.created_at,
                   i.id   AS interest_id,
                   i.name AS interest_name
              FROM events e
         LEFT JOIN event_interests ei ON ei.event_id    = e.id
         LEFT JOIN interests       i  ON i.id            = ei.interest_id
             WHERE e.id = ?
          `;
          db.all(sqlFetch, [eventId], (fetchErr, rows) => {
            if (fetchErr) return next(fetchErr);
            if (!rows.length) {
              return res.status(404).json({ error: 'Event not found.' });
            }
  
            // collapse rows into one event + interests array
            const { interest_id, interest_name, ...eventBase } = rows[0];
            const interests = rows
              .filter(r => r.interest_id != null)
              .map(r => ({ id: r.interest_id, name: r.interest_name }));
  
            res.json({
              message: 'Event updated successfully.',
              event: { ...eventBase, interests }
            });
          });
        });
      }
    );
};

exports.getEventDetails = (req, res, next) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID.' });
  }

  // Single query to fetch the event + its tags
  const sql = `
    SELECT 
      e.id,
      e.title,
      e.description,
      e.location,
      e.date,
      e.created_by,
      e.created_at,
      i.id   AS interest_id,
      i.name AS interest_name
    FROM events e
    LEFT JOIN event_interests ei ON ei.event_id    = e.id
    LEFT JOIN interests       i  ON i.id            = ei.interest_id
    WHERE e.id = ?
  `;

  db.all(sql, [eventId], (err, rows) => {
    if (err) return next(err);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // rows: one row per tag (or one row with null interest if no tags)
    const { interest_id, interest_name, ...base } = rows[0];
    const interests = rows
      .filter(r => r.interest_id != null)
      .map(r => ({ id: r.interest_id, name: r.interest_name }));

    res.json({ event: { ...base, interests } });
  });
};

exports.getMatchedEvents = (req, res, next) => {
    const userId = req.user.id;  // set by authenticateToken
  
    const sql = `
      SELECT DISTINCT
        e.id,
        e.title,
        e.description,
        e.location,
        e.date,
        e.created_by,
        e.created_at
      FROM events e
      JOIN event_interests ei ON ei.event_id    = e.id
      JOIN user_interests  ui ON ui.interest_id = ei.interest_id
      WHERE ui.user_id = ?
        AND e.status = 'approved'
      ORDER BY e.date ASC
    `;
  
    db.all(sql, [userId], (err, events) => {
      if (err) return next(err);
      res.json({ events });
    });
  };
  

exports.deleteEvent = (req, res, next) => {
    const eventId = parseInt(req.params.id, 10);
    const user    = req.user; // from authenticateToken
  
    // 1) Ensure the event exists and get its creator
    db.get(
      `SELECT created_by FROM events WHERE id = ?`,
      [eventId],
      (err, row) => {
        if (err) return next(err);
        if (!row) return res.status(404).json({ error: 'Event not found.' });
  
        // 2) Check permissions: only creator or admin
        if (user.role !== 'admin' && row.created_by !== user.id) {
          return res.status(403).json({ error: 'Forbidden: cannot delete this event.' });
        }
  
        // 3) Perform the delete (ON DELETE CASCADE will clean up tags & RSVPs)
        db.run(
          `DELETE FROM events WHERE id = ?`,
          [eventId],
          function(deleteErr) {
            if (deleteErr) return next(deleteErr);
            if (this.changes === 0) {
              // Shouldn't happen since we checked existence, but just in case
              return res.status(404).json({ error: 'Event not found.' });
            }
            res.json({ message: 'Event deleted successfully.' });
          }
        );
      }
    );
};


exports.approveEvent = (req, res, next) => {
    const eventId = parseInt(req.params.id, 10);
  
    // Update status to 'approved'
    db.run(
      `UPDATE events SET status = 'approved' WHERE id = ?`,
      [eventId],
      function(err) {
        if (err) return next(err);
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Event not found.' });
        }
        res.json({ message: 'Event approved.' });
      }
    );
};

exports.rejectEvent = (req, res, next) => {
    const eventId = parseInt(req.params.id, 10);
    db.run(
      `UPDATE events SET status = 'rejected' WHERE id = ?`,
      [eventId],
      function(err) {
        if (err) return next(err);
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Event not found.' });
        }
        res.json({ message: 'Event rejected.' });
      }
    );
};

