// controllers/categories.controller.js
const db = require('../models/db');

exports.listCategories = (req, res, next) => {
  db.all(
    `SELECT id, name FROM categories ORDER BY name;`,
    (err, rows) => {
      if (err) return next(err);
      res.json(rows);
    }
  );
};

exports.listByCategory = (req, res, next) => {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }
  
    const sql = `
      SELECT id, name
        FROM interests
       WHERE category_id = ?
       ORDER BY name;
    `;
  
    db.all(sql, [categoryId], (err, rows) => {
      if (err) return next(err);
      res.json(rows); // will be [] if none found
    });
  };

  exports.listInterests = (req, res, next) => {
    db.all(
      `SELECT id, name FROM interests ORDER BY name;`,
      (err, rows) => {
        if (err) {
          console.error("Error fetching interests:", err);
          return next(err);
        }
        res.json(rows);
      }
    );
  };
  
