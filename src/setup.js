import db from './db.js';

/**
 * Tests the database connection by running a simple query.
 * Logs the result so you can confirm the app can talk to PostgreSQL.
 */
export const testConnection = async () => {
  const result = await db.query('SELECT NOW() AS now');
  console.log('Database connection OK:', result.rows[0].now);
  return result.rows[0];
};
