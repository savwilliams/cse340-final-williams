import { body } from 'express-validator';

const exerciseBodyValidation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Name must be between 1 and 200 characters'),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be no more than 1000 characters')
];

export { exerciseBodyValidation };
