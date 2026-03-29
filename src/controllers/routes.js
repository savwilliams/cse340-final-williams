import { Router } from 'express';
import { homePage } from './index.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout } from './forms/login.js';
import { requireRole } from '../middleware/auth.js';
import { showDashboard } from './forms/login.js';
import planRequestsRouter from './planRequests/planRequests.js';
import manageUsersRouter from './admin/manageUsers.js';
import manageExercisesRouter from './admin/manageExercises.js';

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
router.get('/dashboard', requireRole('trainee'), showDashboard);
router.get('/admin-dashboard', requireRole('admin'), showDashboard);
router.get('/coach-dashboard', requireRole('coach'), showDashboard);
// Admin user management (/admin/users, …)
router.use('/admin', manageUsersRouter);
// Plan requests (trainee, coach, and /admin/plan-requests)
router.use(planRequestsRouter);
// Admin exercise management (/admin/exercises, …)
router.use('/admin', manageExercisesRouter);



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
