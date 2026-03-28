import { body } from 'express-validator';

const planRequestBodyValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2–200 characters'),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Description must be no more than 5000 characters')
];

const planRequestUpdateValidation = [
    body('workout_plan')
        .trim()
        .isLength({ max: 10000 })
        .withMessage('Workout plan must be no more than 10000 characters'),
    body('status')
        .trim()
        .isIn(['submitted', 'in_progress', 'completed'])
        .withMessage('Invalid status')
];

export { planRequestBodyValidation, planRequestUpdateValidation };
