const pool = require('../config/db');

// CASHEIR
const createPayment = async (order_id, amount, method, status, transaction_ref = null) => {
    const result = await pool.query(
        `INSERT INTO payments (order_id, amount, method, status, transaction_ref)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [order_id, amount, method, status, transaction_ref]
    );
    return result.rows[0];
};

const getPaymentByOrderId = async (orderId) => {
    const result = await pool.query(
        `SELECT id, order_id, amount, method, status, transaction_ref, created_at
         FROM payments WHERE order_id = $1`,
        [orderId]
    );
    return result.rows[0];
};
// ADMIN 
const refundPayment = async (id) => {
    const result = await pool.query(
        `UPDATE payments SET status = 'refunded'
         WHERE id = $1
         AND status = 'paid'
         RETURNING id, order_id, amount, method, status`,
        [id]
    );
    return result.rows[0]; // returns undefined if payment wasn't paid
};

const getAllPayments = async () => {
    const result = await pool.query(
        `SELECT * FROM payments ORDER BY created_at DESC`
    );
    return result.rows;
};

module.exports = {
    createPayment,
    getPaymentByOrderId,
    refundPayment,
    getAllPayments
};