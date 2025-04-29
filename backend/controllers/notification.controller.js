const db = require('../models/db');
const { sendEmail } = require('../utils/emailUtils'); 
const { notifyUsersAboutEvent } = require('../utils/notificationUtils');

const getUserEmail = (userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT email FROM users WHERE id = ?`;
      db.get(query, [userId], (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row || !row.email) {
          return reject(new Error('Email not found for the given user ID'));
        }
        resolve(row.email); // Resolve the email
      });
    });
  };

  exports.sendEventNotification = async (req, res) => {
    try {
      const eventsQuery = `SELECT id, title, date FROM events`;
      db.all(eventsQuery, [], async (err, events) => {
        if (err) {
          console.error('Error fetching events:', err);
          return res.status(500).json({ error: 'Database error while fetching events' });
        }
  
        for (const event of events) {
          try {
            await notifyUsersAboutEvent(event.id, event.title, event.date);
          } catch (notifyErr) {
            console.error(`Error notifying users about event ${event.title}:`, notifyErr);
            // You may decide to continue or break here based on how critical a single failure is
          }
        }
  
        res.status(200).json({ message: 'Notifications sent for all events' });
      });
    } catch (error) {
      console.error('Failed to send event notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  };

  

//Sends a confirmation email when a user enables notifications.
exports.handleNotificationToggle = async (req, res) => {
  const { userId, enableNotifications } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userEmail = await getUserEmail(userId);

    if (enableNotifications) {
      // 1. Send confirmation email
      const message = `You have successfully enabled notifications. You'll now receive updates for all events!`;
      await sendEmail(userEmail, 'Event Notifications were enabled!', message);
    }

    // 2. Update notification preference
    const updateQuery = `UPDATE users SET notifications_enabled = ? WHERE id = ?`;
    await new Promise((resolve, reject) => {
      db.run(updateQuery, [enableNotifications ? 1 : 0, userId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // 3. If enabling notifications, immediately send alerts for existing events
    if (enableNotifications) {
      const eventsQuery = `SELECT id, title, date FROM events`;
      db.all(eventsQuery, [], async (err, events) => {
        if (err) {
          console.error('Error fetching events:', err);
          return res.status(500).json({ error: 'Database error while fetching events' });
        }

        for (const event of events) {
          try {
            await notifyUsersAboutEvent(event.id, event.title, event.date, [userId]); // limit to just this user
          } catch (notifyErr) {
            console.error(`Error notifying user about event ${event.title}:`, notifyErr);
          }
        }

        return res.status(200).json({ message: 'Notification preference updated and alerts sent' });
      });
    } else {
      res.status(200).json({ message: 'Notification preference updated successfully' });
    }
  } catch (error) {
    console.error('Error handling notification toggle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  

