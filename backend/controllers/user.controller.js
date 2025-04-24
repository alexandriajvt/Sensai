const db = require('../models/db');

exports.getUserInfo = (req, res, next) => {
  // Parse the requested user ID from the URL parameters.
  const requestedUserId = parseInt(req.params.id, 10);
  const loggedInUser = req.user; // Set by your authentication middleware

  // Authorization check: allow if the logged in user is retrieving their own info or is an admin.
  if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  // SQL to select the user information.
  const sql = `
    SELECT id, name, email, student_id, major, classification, role, created_at, residence 
    FROM users 
    WHERE id = ?
  `;

  // Use db.get to retrieve a single record matching the requested user ID.
  db.get(sql, [requestedUserId], (err, row) => {
    if (err) {
      return next(err);
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(row);
  });
};


exports.updateUser = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  const loggedInUser = req.user; // set by authenticateToken

  // Authorization check: user can update themselves, or admins can update anyone
  if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  // Extract fields from body
  const {
    name,
    email,
    student_id,
    major,
    classification,
    role,
    residence
  } = req.body;

  const sql = `
    UPDATE users
       SET name           = COALESCE(?, name),
           email          = COALESCE(?, email),
           student_id     = COALESCE(?, student_id),
           major          = COALESCE(?, major),
           classification = COALESCE(?, classification),
           role           = COALESCE(?, role),
           residence      = COALESCE(?, residence)
     WHERE id = ?
  `;

  const params = [
    name,
    email,
    student_id,
    major,
    classification,
    role,
    residence,
    requestedUserId
  ];

  db.run(sql, params, function(err) {
    if (err) {
      return next(err);
    }
    if (this.changes === 0) {
      // No rows updated: user not found
      return res.status(404).json({ error: 'User not found.' });
    }
    // Fetch the updated user to return in response
    db.get(
      `SELECT id, name, email, student_id, major, classification, residence, role, created_at
         FROM users
        WHERE id = ?`,
      [requestedUserId],
      (err2, row) => {
        if (err2) {
          return next(err2);
        }
        res.json({ message: 'User updated successfully.', user: row });
      }
    );
  });
};
