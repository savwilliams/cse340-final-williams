import { Router } from 'express';
import { getAllUsers, promoteTraineeToCoach } from '../../models/users/users.js';
import { requireRole } from '../../middleware/auth.js';

const router = Router();

const parseUserId = (req, res, next) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
        return res.redirect('/admin/users');
    }
    req.targetUserId = id;
    next();
};

const showUsersList = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('users/list', {
            title: 'Manage Users',
            users
        });
    } catch (err) {
        console.error('[manageUsers]', err);
        next(err);
    }
};

const promoteUserToCoach = async (req, res, next) => {
    try {
        await promoteTraineeToCoach(req.targetUserId);
        res.redirect('/admin/users');
    } catch (err) {
        console.error('[manageUsers]', err);
        next(err);
    }
};


router.get('/users', requireRole('admin'), showUsersList);
router.post(
    '/users/:id/promote',
    requireRole('admin'),
    parseUserId,
    promoteUserToCoach
);

export default router;
