import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser } from '../../models/forms/registration.js';
import { registrationValidation } from '../../middleware/validation/forms.js';

const router = Router();


/**
 * Handle user registration with validation and password hashing
 */
const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        if ( await emailExists(email)) {
            console.log('Email already registered');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await saveUser(name, email, hashedPassword, 'trainee');

        console.log('User registered successfully');
        
        res.redirect('/login');
       
    } catch (error) {
        console.error('Error registering user:', error);
        res.redirect('/register');
    }
};

// Display the registration form page
const showRegistrationForm = (req, res) => {
    res.render('forms/register/form', {
      title: 'Register'
    });
  };

// Routes
router.get('/', showRegistrationForm);
router.post('/', registrationValidation, processRegistration);

export default router;