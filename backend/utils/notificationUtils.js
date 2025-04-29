const db = require('../models/db');
const { sendEmail } = require('./emailUtils'); // Adjust path as needed

const notifyUsersAboutEvent = async (eventId, eventTitle, eventDate, targetUserIds = null) => {
    let query = `
        SELECT DISTINCT u.email, ui.interest_id  -- ✅ Ensure distinct users per event
        FROM users u
        JOIN user_interests ui ON u.id = ui.user_id
        JOIN event_interests ei ON ui.interest_id = ei.interest_id
        WHERE ei.event_id = ? AND u.notifications_enabled = 1
    `;

    let params = [eventId];

    // ✅ Apply target user filtering if needed
    if (targetUserIds && targetUserIds.length > 0) {
        const placeholders = targetUserIds.map(() => '?').join(',');
        query += ` AND u.id IN (${placeholders})`;
        params.push(...targetUserIds);
    }

    return new Promise((resolve, reject) => {
        db.all(query, params, async (err, rows) => {
            if (err) {
                console.error("Database error fetching users:", err);
                return reject(err);
            }

            if (!rows || rows.length === 0) {
                console.log(`No interested users found for event: ${eventTitle} (ID: ${eventId})`);
                return resolve(); // ✅ Avoid undefined errors
            }

            console.log(`Event ID: ${eventId} | Title: ${eventTitle} | Date: ${eventDate}`);
            console.log("Users who will be notified:");

            // ✅ Ensure each user gets only **one** notification per event
            const notifiedUsers = new Set();
            for (const row of rows) {
                if (notifiedUsers.has(row.email)) continue; // 🚀 Skip duplicates

                console.log(`Notifying ${row.email} (Interest ID: ${row.interest_id})`);
                notifiedUsers.add(row.email); // ✅ Mark as notified

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
