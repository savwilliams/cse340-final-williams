import { Router } from 'express';
import { homePage } from './index.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout } from './forms/login.js';
import {requireLogin, requireRole} from '../middleware/auth.js';
import { showDashboard} from './forms/login.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
// Registration routes
router.use('/register', registrationRoutes);
// Login routes
router.use('/login', loginRoutes);
// Logout routes
router.get('/logout', processLogout);
// Dashboard routes
router.get('/dashboard', requireLogin, showDashboard);
router.get('/admin-dashboard', requireRole('admin'), showDashboard);

// // Add login-specific styles to all login routes
// router.use('/login', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/login.css">');
//     next();
// });

// // Add register-specific styles to all register routes
// router.use('/register', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/register.css">');
//     next();
// });

export default router;
