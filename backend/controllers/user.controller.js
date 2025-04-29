//user.controller.js
const db = require('../models/db');


exports.getUserInfo = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);

  db.get('SELECT * FROM users WHERE id = ?', [requestedUserId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to retrieve user info.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  });
};


exports.updateUser = (req, res, next) => {
  console.log("Received PUT request for user ID:", req.params.id);
  console.log("Request body:", req.body);
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
    notifications_enabled,
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
           residence      = COALESCE(?, residence),
           notifications_enabled = COALESCE(?, notifications_enabled)
     WHERE id = ?
  `;
  const params = [
    name, email, student_id, major, classification, role, residence, notifications_enabled ? 1 : 0,
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
               u.classification, u.role, u.residence, u.created_at,u.notifications_enabled,
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


exports.getUserInterests = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);

  const sqlQuery = `SELECT interest_id FROM user_interests WHERE user_id = ?`;
  
  db.all(sqlQuery, [requestedUserId], (err, rows) => {
      if (err) return next(err);
      const interestIds = rows.map(row => row.interest_id);
      
      res.json({ interestIds });
  });
};


exports.updateUserInterests = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  const loggedInUser = req.user;
  //console.log("Received interests for update:", interestIds); // ✅ 
  // Authorization: Ensure user is allowed to update their own interests or is an admin
  //if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
  //  return res.status(403).json({ error: 'Access denied.' });
 // }

  const { interestIds } = req.body; // Extract selected interest IDs from request body

  if (!Array.isArray(interestIds)) {
    return res.status(400).json({ error: 'Invalid interests format.' });
  }

  // Start transaction to update user interests
  db.run(`DELETE FROM user_interests WHERE user_id = ?`, [requestedUserId], (delErr) => {
    if (delErr) return next(delErr);

    if (interestIds.length > 0) {
      const stmt = db.prepare(`INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)`);
      interestIds.forEach((interestId) => {
        stmt.run(requestedUserId, interestId);
      });
      stmt.finalize((err) => {
        if (err) return next(err);
        res.json({ message: 'User interests updated successfully.' });
      });
    } else {
      res.json({ message: 'User interests cleared successfully.' });
    }
  });
};




exports.getNotificationPreference = async (req, res) => {
  const { userId } = req.params;

  db.get('SELECT notifications_enabled FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch preference' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ notificationsEnabled: row.notifications_enabled });
  });
};
