import db from '../db.js';

/**
 * Checks if an email address is already registered in the database.
 * @param {string} email 
 * @returns {Promise<boolean>} 
 */
const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;
    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};


/**
 * Saves a new user to the database with a hashed password. * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} hashedPassword 
 * @param {string} role all new users begin as trainee role
 * @returns {Promise<Object>} newly created user record 
 */
const saveUser = async (name, email, hashedPassword, role) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
    `;
    const result = await db.query(query, [name, email, hashedPassword, role]);
    return result.rows[0];
};

export { emailExists, saveUser };