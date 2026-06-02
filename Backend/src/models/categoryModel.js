const pool = require('../config/db');

const getAllCategories = async () => {
    const result = await pool.query(
        `SELECT id, name, description, image_url FROM categories`
    );
    return result.rows;
};

const getCategoryById = async (id) => {
    const result = await pool.query(
        `SELECT id, name, description, image_url FROM categories WHERE id = $1`,
        [id]
    );
    return result.rows[0]; // returns the category or undefined if not found
};

module.exports = {
    getAllCategories,
    getCategoryById
};