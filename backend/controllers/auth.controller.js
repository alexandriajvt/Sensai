// controllers/auth.controller.js
const db     = require('../models/db');
const bcrypt = require('bcryptjs');

exports.register = (req, res, next) => {
  const {
    name,
    email,
    password,
    stu_id,
    major,
    classification,
    role,
    residence,
    interestIds = []       // <-- pull an array of IDs (or empty)
  } = req.body;

  // 1) Hash the password
  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) return next(hashErr);

    // 2) Insert into users
    const sql = `
      INSERT INTO users
        (name, email, password, student_id, major, classification, role, residence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(sql,
      [name, email, hashedPassword, stu_id, major, classification, role, residence],
      function(err) {
        if (err) return next(err);

        const userId = this.lastID;

        // 3) Link any interests
        if (Array.isArray(interestIds) && interestIds.length) {
          const linkStmt = db.prepare(`
            INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)
          `);
          interestIds.forEach(iid => {
            linkStmt.run(userId, iid);
          });
          linkStmt.finalize(linkErr => {
            if (linkErr) return next(linkErr);
            // 4) Done with both user + interests
            res.status(201).json({
              message: 'User registered successfully with interests!',
              userId
            });
          });
        } else {
          // No tags to link: finish here
          res.status(201).json({
            message: 'User registered successfully!',
            userId
          });
        }
      }
    );
  });
};
