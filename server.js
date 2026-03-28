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


// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Prevent infinite loops, if a response has already been sent, do nothing
  if (res.headersSent || res.finished) {
      return next(err);
  }

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  // Prepare data for the template
  const context = {
      title: status === 404 ? 'Page Not Found' : 'Server Error',
      error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
      stack: NODE_ENV === 'production' ? null : err.stack,
      NODE_ENV // Our WebSocket check needs this and its convenient to pass along
  };

  // Render the appropriate error template with fallback
  try {
      res.status(status).render(`errors/${template}`, context);
  } catch (renderErr) {
      // If rendering fails, send a simple error page instead
      if (!res.headersSent) {
          res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
      }
  }
});

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
