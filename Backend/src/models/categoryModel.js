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

// admin only
const createCategory = async (name, description, image_url) => {
    const result = await pool.query(
        `INSERT INTO categories (name, description, image_url)
         VALUES ($1, $2, $3)
         RETURNING id, name, description, image_url`,
        [name, description, image_url]
    );
    return result.rows[0];
};
const updateCategory = async (id, { name, description, image_url }) => {
    const result = await pool.query(
        `UPDATE categories
         SET name = $1, description = $2, image_url = $3
         WHERE id = $4
         RETURNING id, name, description, image_url`,
        [name, description, image_url, id]
    );
    return result.rows[0]; // undefined if no category with that id
};
const deleteCategory = async (id) => {
    const result = await pool.query(
        `DELETE FROM categories WHERE id = $1 RETURNING id`,
        [id]
    );
    return result.rows[0]; // undefined if no category with that id existed
};
module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};