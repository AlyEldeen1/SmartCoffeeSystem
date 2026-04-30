const pool = require('../config/db'); 

const createUser = async (name, email , phone, password_hash, role) => {
    const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role`, // return safe data only
    [name, email, phone, password_hash, role]
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

module.exports = {
    createUser,
    getUserByEmail
};
