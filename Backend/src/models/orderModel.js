const pool = require('../config/db');

// CUSTOMER & CASHIER
const createOrder = async (user_id, cashier_id, source, subtotal, discount_amount, total_price, promo_code_id = null) => {
    const result = await pool.query(
        `INSERT INTO orders (user_id, cashier_id, source, subtotal, discount_amount, total_price, promo_code_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [user_id, cashier_id, source, subtotal, discount_amount, total_price, promo_code_id]
    );
    return result.rows[0];
};

const getOrdersByUser = async (userId) => {
    const result = await pool.query(
        `SELECT id, status, subtotal, discount_amount, total_price, source, created_at
         FROM orders WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

const getOrderById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM orders WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};
// CASHIER & BARISTA
const getOrdersByStatus = async (status) => {
    const result = await pool.query(
        `SELECT * FROM orders WHERE status = $1
         ORDER BY created_at ASC`,
        [status]
    );
    return result.rows;
};

const updateOrderStatus = async (id, status) => {
    const result = await pool.query(
        `UPDATE orders SET status = $1
         WHERE id = $2
         RETURNING id, status, updated_at`,
        [status, id]
    );
    return result.rows[0];
};

const getAllOrders = async () => {
    const result = await pool.query(
        `SELECT * FROM orders ORDER BY created_at DESC`
    );
    return result.rows;
};
// CASHIER OR ADMIN
const cancelOrder = async (id) => {
    const result = await pool.query(
        `UPDATE orders SET status = 'cancelled'
         WHERE id = $1
         AND status IN ('pending', 'preparing')
         RETURNING id, status`,
        [id]
    );
    return result.rows[0]; // returns undefined if order can't be cancelled
};

module.exports = {
    createOrder,
    getOrdersByUser,
    getOrderById,
    getOrdersByStatus,
    updateOrderStatus,
    getAllOrders,
    cancelOrder
};