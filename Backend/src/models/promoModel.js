const pool = require('../config/db');

// CUSTOMER
const getPromoByCode = async (code) => {
    const result = await pool.query(
        `SELECT * FROM promo_codes WHERE code = $1`,
        [code]
    );
    return result.rows[0];
};
// ADMIN ONLY
const createPromoCode = async (code, discount_type, discount_value, min_order_amount, max_uses, expires_at) => {
    const result = await pool.query(
        `INSERT INTO promo_codes (code, discount_type, discount_value, min_order_amount, max_uses, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [code, discount_type, discount_value, min_order_amount, max_uses, expires_at]
    );
    return result.rows[0];
};

const togglePromoActive = async (id) => {
    const result = await pool.query(
        `UPDATE promo_codes
         SET is_active = NOT is_active
         WHERE id = $1
         RETURNING id, code, is_active`,
        [id]
    );
    return result.rows[0];
};

const getAllPromoCodes = async () => {
    const result = await pool.query(
        `SELECT * FROM promo_codes ORDER BY created_at DESC`
    );
    return result.rows;
};

const incrementUsedCount = async (id) => {
    const result = await pool.query(
        `UPDATE promo_codes
         SET used_count = used_count + 1
         WHERE id = $1
         RETURNING id, code, used_count, max_uses`,
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getPromoByCode,
    createPromoCode,
    togglePromoActive,
    getAllPromoCodes,
    incrementUsedCount
};