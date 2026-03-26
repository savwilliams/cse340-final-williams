import { Router } from 'express';
import { homePage } from './index.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';

const router = Router();

router.get('/', homePage);
router.use('/register', registrationRoutes);
router.use('/login', loginRoutes);

export default router;
