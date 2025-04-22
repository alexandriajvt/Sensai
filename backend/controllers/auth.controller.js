const db = require('../models/db');
const bcrypt = require('bcryptjs');

exports.register = (req, res, next) => {
  const { name, email, password, stu_id, major, classification, role, residence } = req.body;

  // Hash the password for security
  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      return next(hashErr);
    }

    // SQL statement to insert a new user
    const sql = `
      INSERT INTO users (name, email, password,student_id, major,classification,role, residence)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;
    
    // Run the SQL command using the sqlite3 run method
    db.run(sql, [name, email, hashedPassword,stu_id, major, classification, role, residence], function(err) {
      if (err) {
        return next(err);
      }
      
      // 'this.lastID' contains the ID of the newly inserted row
      res.status(201).json({
        message: 'User registered successfully!',
        userId: this.lastID
      });
    });
  });
};
