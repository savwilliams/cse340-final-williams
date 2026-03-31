import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';
import { loginValidation } from '../../middleware/validation/forms.js';


const router = Router();


/**
 * Process login form submission.
 */
const processLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors:');
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            console.error('User not found');
            return res.redirect('/login');
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password');
            return res.redirect('/login');
        }
        
        delete user.password;

        req.session.user = user;
        return req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.redirect('/login');
            }
            return res.redirect('/');
        });

    } catch (error) {
        console.error('Error logging in:', error);
        return res.redirect('/login');
    }

    
};

/**
 * Handle user logout.
 */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);

            res.clearCookie('connect.sid');

            return res.redirect('/');
        }

        res.clearCookie('connect.sid');

        res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login)
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    return res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

/**
 * Display the login form.
 */
const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'Login'
    });
}; 

// Routes
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };