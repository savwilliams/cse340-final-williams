import db from './db.js';

/**
 * Tests the database connection
 */
export const testConnection = async () => {
  const result = await db.query('SELECT NOW() AS now');
  console.log('Database connection OK:', result.rows[0].now);
  return result.rows[0];
};
