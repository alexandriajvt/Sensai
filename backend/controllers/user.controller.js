// controllers/user.controller.js
const db = require('../models/db');

exports.getUserInfo = async (req, res, next) => {
  try {
    const requestedUserId = parseInt(req.params.id, 10);
    const loggedInUser = req.user; // comes from the authentication middleware

    // Authorization check: allow if the user is retrieving their own info or is an admin.
    if (loggedInUser.id !== requestedUserId && loggedInUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const [rows] = await db.query(
      'SELECT id, name, email, role, student_id, major, created_at, residence FROM users WHERE id = ?',
      [requestedUserId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};
