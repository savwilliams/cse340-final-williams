import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CA certificate content
const caCert = fs.readFileSync(path.join(__dirname, '..','..','bin', 'byuicse-psql-cert.pem'));

const toPositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Connection pool for PostgreSQL database.
 */
const pool = new Pool({
    connectionString: process.env.DB_URL,
    max: toPositiveInt(process.env.DB_POOL_MAX, 5),
    idleTimeoutMillis: toPositiveInt(process.env.DB_POOL_IDLE_MS, 30000),
    connectionTimeoutMillis: toPositiveInt(process.env.DB_POOL_CONNECT_TIMEOUT_MS, 10000),
    ssl: {
        ca: caCert,  
        rejectUnauthorized: true, 
        checkServerIdentity: () => { return undefined; }
    }
});

/**
 * use the same name for the export regardless of whether I'm in
 * development or production mode.
 */
let db = null;

if (process.env.NODE_ENV?.toLowerCase().includes('dev') && process.env.ENABLE_SQL_LOGGING === 'true') {
    /**
     * In development mode >> wrap the pool to provide query logging.
     * This helps with debugging by showing all executed queries in the console.
     */
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });
                return res;
            } catch (error) {
                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    // In production, export the pool directly without logging overhead
    db = pool;
}

export default db;
export { caCert, pool };
