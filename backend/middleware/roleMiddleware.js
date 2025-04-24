// middleware/roleMiddleware.js

/**
 * Returns an Express middleware that allows access
 * only if the authenticated user's role is in allowedRoles.
 *
 * @param {string[]} allowedRoles - e.g. ['organizer','admin']
 */
function authorize(allowedRoles) {
    return (req, res, next) => {
      // req.user is set by your authenticateToken middleware
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }
      next();
    };
  }
  
  module.exports = authorize;
  