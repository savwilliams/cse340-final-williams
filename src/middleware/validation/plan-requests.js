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

export { planRequestBodyValidation };
