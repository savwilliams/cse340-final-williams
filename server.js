//==============================================
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/models/setup.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { caCert } from './src/models/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';
// Import MVC components
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
//==============================================

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

//==============================================

/**
 * Configure Session
 */
// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

// Configure session middleware
app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL,
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Start automatic session cleanup
startSessionCleanup();

//==============================================

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
//enable Express to parse POST form bodies
app.use(express.urlencoded({ extended: true }));

//==============================================

/**
 * Global Middleware
 */
app.use(addLocalVariables);

//==============================================

/**
 * Routes 
 */
app.use('/', routes);

//==============================================

/**
 * Start Server
 */
app.listen(PORT, async () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
  try {
    await testConnection();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
});

//==============================================
