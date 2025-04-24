const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Login Endpoint using SQLite
exports.login = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  // Use db.get to fetch a single row matching the email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    // Compare the provided password with the stored hashed password using callbacks
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        return next(compareErr);
      }
      
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      
      // Generate a JWT using the user id and role from the SQLite record
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  });
};

// Logout Endpoint (Simple Stateless Logout)
exports.logout = (req, res, next) => {
  // In a stateless JWT approach, there's no session to destroy on the server.
  // Simply return a response indicating logout was successful.
  res.status(200).json({ message: 'Logout successful. Please remove the token on the client side.' });
};
