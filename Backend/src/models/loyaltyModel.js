const pool = require('../config/db');

const addLoyaltyTransaction = async (user_id, order_id, points_change, reason) => {
    const result = await pool.query(
        `INSERT INTO loyalty_transactions (user_id, order_id, points_change, reason)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, order_id, points_change, reason]
    );
    return result.rows[0];
};

const getLoyaltyHistory = async (userId) => {
    const result = await pool.query(
        `SELECT id, order_id, points_change, reason, created_at
         FROM loyalty_transactions
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

module.exports = {
    addLoyaltyTransaction,
    getLoyaltyHistory
};