const pool = require('../config/db');

const getAllProductsByCategory = async (categoryId) => {
    const result = await pool.query(
        `SELECT id, name, description, price, image_url, is_available
         FROM products
         WHERE category_id = $1 AND is_available = true`,
        [categoryId]
    );
    return result.rows;
};

const getProductById = async (id) => {
    const result = await pool.query(
        `SELECT id, name, description, price, image_url, is_available, created_at
         FROM products WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};
// ADMIN ONLY

const createProduct = async (category_id, name, description, price, image_url) => {
    const result = await pool.query(
        `INSERT INTO products (category_id, name, description, price, image_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, description, price, image_url, is_available, created_at`,
        [category_id, name, description, price, image_url]
    );
    return result.rows[0];
};

const updateProduct = async (id, fields) => {
    const { name, description, price, image_url, category_id } = fields;
    const result = await pool.query(
        `UPDATE products
         SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5
         WHERE id = $6
         RETURNING id, name, description, price, image_url, is_available`,
        [name, description, price, image_url, category_id, id]
    );
    return result.rows[0];
};

const toggleProductAvailability = async (id) => {
    const result = await pool.query(
        `UPDATE products
         SET is_available = NOT is_available
         WHERE id = $1
         RETURNING id, name, is_available`,
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getAllProductsByCategory,
    getProductById,
    createProduct,
    updateProduct,
    toggleProductAvailability
};