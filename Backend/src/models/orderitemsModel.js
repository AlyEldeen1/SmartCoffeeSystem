const pool = require('../config/db');

const addOrderItem = async (order_id, product_id, quantity, unit_price, subtotal) => {
    const result = await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [order_id, product_id, quantity, unit_price, subtotal]
    );
    return result.rows[0];
};

const getOrderItems = async (orderId) => {
    const result = await pool.query(
        `SELECT oi.id, oi.quantity, oi.unit_price, oi.subtotal,
                p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [orderId]
    );
    return result.rows;
};

module.exports = {
    addOrderItem,
    getOrderItems
};