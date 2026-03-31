import { Router } from 'express';
import { validationResult } from 'express-validator';
import { getAllExercises, createExercise, updateExercise, deleteExercise } from '../../models/exercises/exercises.js';
import { requireRole } from '../../middleware/auth.js';
import { exerciseBodyValidation } from '../../middleware/validation/exercises.js';

const router = Router();

const listPath = '/admin/exercises';

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
    const exerciseId = parseInt(req.params.id);
    if (Number.isNaN(exerciseId) || exerciseId < 1) {
        return res.redirect(listPath);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Exercise validation:', errors.array());
        return res.redirect(listPath);
    }
    try {
        const { name, description } = req.body;
        await updateExercise(exerciseId, name, description || null);
        res.redirect(listPath);
    } catch (err) {
        console.error('[manageExercises]', err);
        next(err);
    }
};

const deleteExerciseHandler = async (req, res, next) => {
    try {
        const exerciseId = parseInt(req.params.id);
        if (Number.isNaN(exerciseId) || exerciseId < 1) {
            return res.redirect(listPath);
        }
        await deleteExercise(exerciseId);
        res.redirect(listPath);
    } catch (err) {
        console.error('[manageExercises]', err);
        next(err);
    }
};

router.get('/exercises', requireRole('admin'), showExercisesList);
router.post('/exercises', requireRole('admin'), exerciseBodyValidation, createExerciseHandler);
router.post('/exercises/:id/update', requireRole('admin'), exerciseBodyValidation, updateExerciseHandler);
router.post('/exercises/:id/delete', requireRole('admin'), deleteExerciseHandler);

export default router;
