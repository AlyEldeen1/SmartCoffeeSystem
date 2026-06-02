const pool = require('../config/db');

const getAllInventory = async () => {
    const result = await pool.query(
        `SELECT id, name, unit, current_stock, threshold_level, last_restocked_at
         FROM inventory`
    );
    return result.rows;
};

const getLowStockItems = async () => {
    const result = await pool.query(
        `SELECT id, name, unit, current_stock, threshold_level
         FROM inventory
         WHERE current_stock < threshold_level`
    );
    return result.rows;
};
// ADMIN ONLY
const createInventoryItem = async (name, unit, current_stock, threshold_level) => {
    const result = await pool.query(
        `INSERT INTO inventory (name, unit, current_stock, threshold_level)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, unit, current_stock, threshold_level`,
        [name, unit, current_stock, threshold_level]
    );
    return result.rows[0];
};

const updateStock = async (id, current_stock) => {
    const result = await pool.query(
        `UPDATE inventory
         SET current_stock = $1, last_restocked_at = NOW()
         WHERE id = $2
         RETURNING id, name, unit, current_stock, last_restocked_at`,
        [current_stock, id]
    );
    return result.rows[0];
};

const deleteInventoryItem = async (id) => {
    const result = await pool.query(
        `DELETE FROM inventory WHERE id = $1
         RETURNING id, name`,
        [id]
    );
    return result.rows[0];
};

module.exports = {
    getAllInventory,
    getLowStockItems,
    createInventoryItem,
    updateStock,
    deleteInventoryItem
};