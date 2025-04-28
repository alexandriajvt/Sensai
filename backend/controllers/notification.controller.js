const { sendEmail } = require('../utils/emailUtils'); 

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
  const { userEmail, eventTitle, eventDate } = req.body;

  if (!userEmail || !eventTitle || !eventDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const message = `You have an upcoming event: "${eventTitle}" on ${eventDate}. Don't miss it!`;
    await sendEmail(userEmail, 'Event Notification', message);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};


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
        await sendEmail(userEmail, 'Notifications Enabled', message);
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
  

