const pool = require('../config/db');

const getProductIngredients = async (productId) => {
    const result = await pool.query(
        `SELECT i.id, i.name, i.unit, pi.quantity_required
         FROM product_ingredients pi
         JOIN inventory i ON pi.inventory_id = i.id
         WHERE pi.product_id = $1`,
        [productId]
    );
    return result.rows;
};

// ADMIN ONLY

const addIngredientToProduct = async (product_id, inventory_id, quantity_required) => {
    const result = await pool.query(
        `INSERT INTO product_ingredients (product_id, inventory_id, quantity_required)
         VALUES ($1, $2, $3)
         RETURNING product_id, inventory_id, quantity_required`,
        [product_id, inventory_id, quantity_required]
    );
    return result.rows[0];
};

const updateIngredientQuantity = async (product_id, inventory_id, quantity_required) => {
    const result = await pool.query(
        `UPDATE product_ingredients
         SET quantity_required = $1
         WHERE product_id = $2 AND inventory_id = $3
         RETURNING product_id, inventory_id, quantity_required`,
        [quantity_required, product_id, inventory_id]
    );
    return result.rows[0];
};

const removeIngredientFromProduct = async (product_id, inventory_id) => {
    const result = await pool.query(
        `DELETE FROM product_ingredients
         WHERE product_id = $1 AND inventory_id = $2
         RETURNING product_id, inventory_id`,
        [product_id, inventory_id]
    );
    return result.rows[0];
};

module.exports = {
    getProductIngredients,
    addIngredientToProduct,
    updateIngredientQuantity,
    removeIngredientFromProduct
};