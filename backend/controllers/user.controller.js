//user.controller.js

const db = require('../models/db');

exports.getUserInfo = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  const loggedInUser    = req.user;

  // Authorization
  if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  // 1) Fetch core user profile
  const sqlUser = `
    SELECT id, name, email, student_id, major, classification, role, created_at, residence
      FROM users
     WHERE id = ?
  `;
  db.get(sqlUser, [requestedUserId], (err, userRow) => {
    if (err) return next(err);
    if (!userRow) return res.status(404).json({ error: 'User not found.' });

    // 2) Fetch the user’s interests
    const sqlInts = `
      SELECT i.id, i.name
        FROM interests i
        JOIN user_interests ui ON ui.interest_id = i.id
       WHERE ui.user_id = ?
       ORDER BY i.name
    `;
    db.all(sqlInts, [requestedUserId], (intErr, interests) => {
      if (intErr) return next(intErr);

      // 3) Respond with profile + interests
      res.json({
        ...userRow,
        interests   // array of { id, name }
      });
    });
  });
};

exports.updateUser = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  const loggedInUser = req.user;

  if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const {
    name,
    email,
    student_id,
    major,
    classification,
    role,
    residence,
    interestIds // array of selected interest IDs from checkboxes
  } = req.body;

  const sqlUpdate = `
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
    name, email, student_id, major, classification, role, residence,
    requestedUserId
  ];

  db.run(sqlUpdate, params, function(err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
//db.serialize allows updates from the user profile
    db.serialize(() => {
      // Only update interests if `interestIds` was provided
      if (Array.isArray(interestIds)) {
        db.run(
          `DELETE FROM user_interests WHERE user_id = ?`,
          [requestedUserId],
          (delErr) => {
            if (delErr) return next(delErr);

            if (interestIds.length > 0) {
              const stmt = db.prepare(
                `INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)`
              );

              interestIds.forEach(iid => {
                stmt.run(requestedUserId, iid);
              });

              stmt.finalize(fetchUpdatedUser);
            } else {
              // If no interests to add, still fetch updated profile
              fetchUpdatedUser();
            }
          }
        );
      } else {
        fetchUpdatedUser(); // Skip interest update, just fetch user
      }
    });

    function fetchUpdatedUser() {
      const sqlFetch = `
        SELECT u.id, u.name, u.email, u.student_id, u.major,
               u.classification, u.role, u.residence, u.created_at,
               i.id   AS interest_id,
               i.name AS interest_name
          FROM users u
     LEFT JOIN user_interests ui ON ui.user_id = u.id
     LEFT JOIN interests     i  ON i.id = ui.interest_id
         WHERE u.id = ?
      `;

      db.all(sqlFetch, [requestedUserId], (fetchErr, rows) => {
        if (fetchErr) return next(fetchErr);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'User not found.' });
        }

        const { interest_id, interest_name, ...base } = rows[0];
        const interests = rows
          .filter(r => r.interest_id != null)
          .map(r => ({ id: r.interest_id, name: r.interest_name }));

        res.json({
          message: 'User updated successfully.',
          user: { ...base, interests }
        });
      });
    }
  });
};
