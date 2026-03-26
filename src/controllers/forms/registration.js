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
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Log validation errors to console for debugging
        console.error('Validation errors:', errors.array());
        // Redirect back to /register
        return res.redirect('/register');
    }

    // Extract validated data from request body
    const { name, email, password } = req.body;

    try {
        // Check if email already exists in database
        if ( await emailExists(email)) {
            console.log('Email already registered');
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database with hashed password
        await saveUser(name, email, hashedPassword, 'trainee');

        // Log success message to console
        console.log('User registered successfully');
        
        // Redirect to login page
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

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

export default router;