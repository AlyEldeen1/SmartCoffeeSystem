const pool = require('../config/db'); 

const createUser = async (name, email , phone_number, password_hash, role) => {
    const result = await pool.query(
    `INSERT INTO users (name, email, phone_number, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone_number, role, is_verified, created_at`,
    [name, email, phone_number, password_hash, role]
  );
    return result.rows[0]; // return user 
};

const getUserByEmail = async (email) => {
    const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
     [email]
  );
    return result.rows[0]; // return user or null
}
// Find user by id — safe fields only (useful for profile route)
const getUserById = async (id) => {
    const result = await pool.query(
        `SELECT id, name, email, phone_number, role, is_verified, created_at
         FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById
};
