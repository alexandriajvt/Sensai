// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Auth Header:", authHeader); // ✅ Debugging output

  if (!authHeader) {
    console.log("Authentication Error: No token provided");
    return res.status(401).json({ error: 'Token required' });
  }

  const token = authHeader && authHeader.split(' ')[1]; // expecting "Bearer <token>"
  console.log("Extracted Token:", token); // ✅ Debugging output

  if (!token) return res.status(401).json({ error: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    console.log("Decoded User:", user); // ✅ Debugging output////////////////
    req.user = user; // attach user info (e.g., id, role) from the token to req.user
    next();
  });
}

module.exports = authenticateToken;
