// controllers/rsvp.controller.js
const db = require('../models/db');

exports.createRsvp = (req, res, next) => {
  const userId  = req.user.id;                // from authenticateToken
  const { eventId, status = 'going' } = req.body;

  // Basic validation
  if (!eventId) {
    return res.status(400).json({ error: 'eventId is required.' });
  }

  // Optional: prevent duplicate RSVPs
  db.get(
    `SELECT id FROM rsvps WHERE user_id = ? AND event_id = ?`,
    [userId, eventId],
    (checkErr, existing) => {
      if (checkErr) return next(checkErr);
      if (existing) {
        return res.status(409).json({ error: 'You have already RSVPed to this event.' });
      }

      // Insert the RSVP
      const sql = `
        INSERT INTO rsvps (user_id, event_id, status)
        VALUES (?, ?, ?)
      `;
      db.run(sql, [userId, eventId, status], function(insertErr) {
        if (insertErr) return next(insertErr);
        res.status(201).json({
          message: 'RSVP created successfully!',
          rsvpId: this.lastID
        });
      });
    }
  );
};


exports.getUserRsvps = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  const loggedInUser    = req.user; // from authenticateToken

  // Authorization: only the user or an admin
  if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const sql = `
    SELECT
      r.id        AS rsvpId,
      r.status    AS rsvpStatus,
      r.timestamp AS rsvpTimestamp,
      e.id        AS eventId,
      e.title     AS eventTitle,
      e.date      AS eventDate,
      e.location  AS eventLocation
    FROM rsvps r
    JOIN events e ON e.id = r.event_id
    WHERE r.user_id = ?
    ORDER BY r.timestamp DESC
  `;

  db.all(sql, [requestedUserId], (err, rows) => {
    if (err) return next(err);
    // rows will be [] if none found
    res.json({ rsvps: rows });
  });
};


exports.updateRsvp = (req, res, next) => {
  const rsvpId = parseInt(req.params.id, 10);
  const user   = req.user;               // from authenticateToken
  const { status } = req.body;           // expected: 'going', 'maybe', or 'not going'

  // 1) Validate inputs
  if (isNaN(rsvpId)) {
    return res.status(400).json({ error: 'Invalid RSVP ID.' });
  }
  const allowed = ['going','maybe','not going'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of ${allowed.join(', ')}.` });
  }

  // 2) Fetch the RSVP to check ownership
  db.get(
    `SELECT user_id FROM rsvps WHERE id = ?`,
    [rsvpId],
    (fetchErr, row) => {
      if (fetchErr) return next(fetchErr);
      if (!row) return res.status(404).json({ error: 'RSVP not found.' });

      // Only the owner or an admin may update it
      if (row.user_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: cannot update this RSVP.' });
      }

      // 3) Perform the update
      db.run(
        `UPDATE rsvps
            SET status = ?, timestamp = CURRENT_TIMESTAMP
          WHERE id = ?`,
        [status, rsvpId],
        function(updateErr) {
          if (updateErr) return next(updateErr);
          if (this.changes === 0) {
            return res.status(404).json({ error: 'RSVP not found.' });
          }

          // 4) Return the updated RSVP record
          db.get(
            `SELECT id AS rsvpId, user_id AS userId, event_id AS eventId,
                    status, timestamp
               FROM rsvps
              WHERE id = ?`,
            [rsvpId],
            (getErr, updated) => {
              if (getErr) return next(getErr);
              res.json({ message: 'RSVP updated.', rsvp: updated });
            }
          );
        }
      );
    }
  );
};

exports.deleteRsvp = (req, res, next) => {
  const rsvpId = parseInt(req.params.id, 10);
  const user   = req.user;  // from authenticateToken

  if (isNaN(rsvpId)) {
    return res.status(400).json({ error: 'Invalid RSVP ID.' });
  }

  // 1) Fetch the RSVP to verify existence and ownership
  db.get(
    `SELECT user_id FROM rsvps WHERE id = ?`,
    [rsvpId],
    (fetchErr, row) => {
      if (fetchErr) return next(fetchErr);
      if (!row) return res.status(404).json({ error: 'RSVP not found.' });

      // 2) Only the owner or an admin may delete
      if (row.user_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: cannot cancel this RSVP.' });
      }

      // 3) Perform the delete
      db.run(
        `DELETE FROM rsvps WHERE id = ?`,
        [rsvpId],
        function(deleteErr) {
          if (deleteErr) return next(deleteErr);
          if (this.changes === 0) {
            return res.status(404).json({ error: 'RSVP not found.' });
          }
          res.json({ message: 'RSVP canceled successfully.' });
        }
      );
    }
  );
};