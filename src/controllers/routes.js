import { Router } from 'express';
import { homePage, loginForm, registerForm } from './index.js';

const router = Router();

router.get('/', homePage);
router.get('/login', loginForm);
router.get('/register', registerForm);

export default router;
