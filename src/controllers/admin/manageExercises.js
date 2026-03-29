import { Router } from 'express';
import { validationResult } from 'express-validator';
import { getAllExercises, createExercise, updateExercise, deleteExercise } from '../../models/exercises/exercises.js';
import { requireRole } from '../../middleware/auth.js';
import { exerciseBodyValidation } from '../../middleware/validation/exercises.js';

const router = Router();

const listPath = '/admin/exercises';

const parseExerciseId = (req, res, next) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
        return res.redirect(listPath);
    }
    req.exerciseId = id;
    next();
};

const showExercisesList = async (req, res, next) => {
    try {
        const exercises = await getAllExercises();
        res.render('exercises/list', {
            title: 'Manage Exercises',
            exercises
        });
    } catch (err) {
        console.error('[manageExercises]', err);
        next(err);
    }
};

const createExerciseHandler = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Exercise validation:', errors.array());
        return res.redirect(listPath);
    }
    try {
        const { name, description } = req.body;
        await createExercise(name, description || null);
        res.redirect(listPath);
    } catch (err) {
        console.error('[manageExercises]', err);
        next(err);
    }
};

const updateExerciseHandler = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Exercise validation:', errors.array());
        return res.redirect(listPath);
    }
    try {
        const { name, description } = req.body;
        await updateExercise(req.exerciseId, name, description || null);
        res.redirect(listPath);
    } catch (err) {
        console.error('[manageExercises]', err);
        next(err);
    }
};

const deleteExerciseHandler = async (req, res, next) => {
    try {
        await deleteExercise(req.exerciseId);
        res.redirect(listPath);
    } catch (err) {
        console.error('[manageExercises]', err);
        next(err);
    }
};

router.get('/exercises', requireRole('admin'), showExercisesList);
router.post('/exercises', requireRole('admin'), exerciseBodyValidation, createExerciseHandler);
router.post('/exercises/:id/update', requireRole('admin'), parseExerciseId, exerciseBodyValidation,updateExerciseHandler);
router.post('/exercises/:id/delete', requireRole('admin'), parseExerciseId, deleteExerciseHandler);

export default router;
