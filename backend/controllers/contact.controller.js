const db = require('../models/db'); // Assuming you're using SQLite or another database

// Save inquiry into the database
exports.submitInquiry = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `INSERT INTO inquiries (name, email, subject, message, created_at) 
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  db.run(query, [name, email, subject, message], (err) => {
    if (err) {
      console.error('Error saving inquiry:', err);
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

    res.status(200).json({ message: 'Inquiry submitted successfully' });
  });
};

// Retrieve all inquiries
exports.viewInquiries = (req, res) => {
  const query = `SELECT * FROM inquiries ORDER BY created_at DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching inquiries:', err);
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }

    res.status(200).json({ inquiries: rows });
  });
};
