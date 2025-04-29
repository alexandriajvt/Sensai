const db = require('../models/db');
const { sendEmail } = require('./emailUtils'); // Adjust path as needed


const notifyUsersAboutEvent = async (eventId, eventTitle, eventDate, targetUserIds = null) => {
    let query = `
      SELECT u.email
      FROM users u
      JOIN user_interests ui ON u.id = ui.user_id
      JOIN event_interests ei ON ui.interest_id = ei.interest_id
      WHERE ei.event_id = ? AND u.notifications_enabled = 1
    `;
  
    let params = [eventId];
  
    if (targetUserIds && targetUserIds.length > 0) {
      const placeholders = targetUserIds.map(() => '?').join(',');
      query += ` AND u.id IN (${placeholders})`;
      params = [eventId, ...targetUserIds];
    }
  
    return new Promise((resolve, reject) => {
      db.all(query, params, async (err, rows) => {
        if (err) return reject(err);
  
        for (const row of rows) {
          const message = `You have an upcoming event: "${eventTitle}" on ${eventDate}. Don't miss it!`;
          try {
            await sendEmail(row.email, 'Event Notification', message);
          } catch (emailErr) {
            console.error(`Failed to send email to ${row.email}:`, emailErr);
          }
        }
  
        resolve();
      });
    });
  };
  

module.exports = {
  notifyUsersAboutEvent
};
