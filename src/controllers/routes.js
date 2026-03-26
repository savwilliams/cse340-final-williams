import { Router } from 'express';
import { homePage, loginForm} from './index.js';
import registrationRoutes from './forms/registration.js';

const router = Router();

router.get('/', homePage);
router.get('/login', loginForm);
router.use('/register', registrationRoutes);

export default router;
