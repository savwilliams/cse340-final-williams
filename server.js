import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/setup.js';

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

/**
 * Configure Express
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


/**
 * Routes
 */
app.get('/', (req, res) => {
  res.render('home', { title: 'Workout Tracker' });
});


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
