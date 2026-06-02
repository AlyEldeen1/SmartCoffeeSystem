const pool = require('../config/db');

const createRecommendationLog = async (user_id, product_id, score, reason) => {
    const result = await pool.query(
        `INSERT INTO recommendation_logs (user_id, product_id, score, reason)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, product_id, score, reason]
    );
    return result.rows[0];
};

const updateWasClicked = async (id) => {
    const result = await pool.query(
        `UPDATE recommendation_logs
         SET was_clicked = true
         WHERE id = $1
         RETURNING id, user_id, product_id, was_clicked`,
        [id]
    );
    return result.rows[0];
};

const getRecommendationsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT rl.id, rl.score, rl.reason, rl.was_clicked, rl.created_at,
                p.name, p.image_url, p.price
         FROM recommendation_logs rl
         JOIN products p ON rl.product_id = p.id
         WHERE rl.user_id = $1
         ORDER BY rl.created_at DESC`,
        [userId]
    );
    return result.rows;
};

const getAllRecommendations = async () => {
    const result = await pool.query(
        `SELECT rl.id, rl.score, rl.reason, rl.was_clicked, rl.created_at,
                p.name, p.price,
                u.name AS user_name, u.email
         FROM recommendation_logs rl
         JOIN products p ON rl.product_id = p.id
         JOIN users u ON rl.user_id = u.id
         ORDER BY rl.created_at DESC`
    );
    return result.rows;
};

module.exports = {
    createRecommendationLog,
    updateWasClicked,
    getRecommendationsByUser,
    getAllRecommendations
};