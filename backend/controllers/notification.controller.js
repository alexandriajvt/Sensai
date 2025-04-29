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
  console.log("Request headers:", req.headers);
  console.log("User object:", req.user);
  const userId = req.user.id; // ✅ Get logged-in user's ID
    try {

        // Get unique events that match the logged-in user's interests
        const eventsQuery = `
            SELECT DISTINCT e.id, e.title, e.date 
            FROM events e
            JOIN event_interests ei ON e.id = ei.event_id
            JOIN user_interests ui ON ei.interest_id = ui.interest_id
            WHERE ui.user_id = ?;  --  Ensures only events related to this user
        `;

        db.all(eventsQuery, [userId], async (err, events) => {
            if (err) {
                console.error('Error fetching events:', err);
                return res.status(500).json({ error: 'Database error while fetching events' });
            }

            if (events.length === 0) {
                console.log(`No matching events found for user ${userId}.`);
                return res.status(200).json({ message: 'No event notifications for this user.' });
            }

            // ✅ Send notifications only once per event
            for (const event of events) {
                try {
                    await notifyUsersAboutEvent(event.id, event.title, event.date, [userId]); // 🔹 Notify only logged-in user
                } catch (notifyErr) {
                    console.error(`Error notifying user about event ${event.title}:`, notifyErr);
                }
            }

            res.status(200).json({ message: 'Notifications sent for matching events only.' });
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
      // Fetch email from the database
      const userEmail = await getUserEmail(userId);
  
      if (enableNotifications) {
        // Sends a notification email (immediate trigger)
        const message = `You have successfully enabled notifications. You'll now receive updates for all events!`;
        await sendEmail(userEmail, 'Event Notifications were enabled!', message);
      }
  
      // Update the notification preference in the database
      const query = `UPDATE users SET notifications_enabled = ? WHERE id = ?`;
      await new Promise((resolve, reject) => {
        db.run(query, [enableNotifications ? 1 : 0, userId], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
  
      res.status(200).json({ message: 'Notification preference updated successfully' });
    } catch (error) {
      console.error('Error handling notification toggle:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

