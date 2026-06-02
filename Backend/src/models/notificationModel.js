const pool = require('../config/db');

const createNotification = async (user_id, title, message) => {
    const result = await pool.query(
        `INSERT INTO notifications (user_id, title, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, title, message]
    );
    return result.rows[0];
};

const getNotificationsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT id, title, message, is_read, created_at
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

const markAsRead = async (id) => {
    const result = await pool.query(
        `UPDATE notifications
         SET is_read = true
         WHERE id = $1
         RETURNING id, is_read`,
        [id]
    );
    return result.rows[0];
};

const markAllAsRead = async (userId) => {
    const result = await pool.query(
        `UPDATE notifications
         SET is_read = true
         WHERE user_id = $1 AND is_read = false
         RETURNING id`,
        [userId]
    );
    return result.rows; // returns all updated notification ids
};

module.exports = {
    createNotification,
    getNotificationsByUser,
    markAsRead,
    markAllAsRead
};