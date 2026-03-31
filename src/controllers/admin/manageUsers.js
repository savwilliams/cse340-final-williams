import { Router } from 'express';
import { getAllUsers, promoteTraineeToCoach } from '../../models/users/users.js';
import { requireRole } from '../../middleware/auth.js';

const router = Router();

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
        const targetUserId = parseInt(req.params.id);
        if (Number.isNaN(targetUserId) || targetUserId < 1) {
            return res.redirect('/admin/users');
        }
        await promoteTraineeToCoach(targetUserId);
        res.redirect('/admin/users');
    } catch (err) {
        console.error('[manageUsers]', err);
        next(err);
    }
};


router.get('/users', requireRole('admin'), showUsersList);
router.post('/users/:id/promote', requireRole('admin'), promoteUserToCoach);

export default router;
