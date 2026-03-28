import { Router } from 'express';
import { validationResult } from 'express-validator';
import { listByTraineeId, findByIdForTrainee, createRequest, updateOwnRequest, deleteOwnRequest } from '../models/plan-requests.js';
import { planRequestBodyValidation } from '../middleware/validation/plan-requests.js';

const router = Router();

const traineeId = (req) => req.session.user.id;

const parseRequestId = (req, res, next) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
        return res.redirect('/plan-requests');
    }
    req.planRequestId = id;
    next();
};

const listPlanRequests = async (req, res) => {
    try {
        const rows = await listByTraineeId(traineeId(req));
        res.render('plan-requests/list', {
            title: 'My plan requests',
            requests: rows
        });
    } catch (err) {
        console.error('listPlanRequests', err);
        res.redirect('/dashboard');
    }
};

const newPlanRequestForm = (req, res) => {
    res.render('plan-requests/new', {
        title: 'New plan request'
    });
};

const createPlanRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Plan request validation:', errors.array());
        return res.redirect('/plan-requests/new');
    }
    const { name, description } = req.body;
    try {
        const row = await createRequest(traineeId(req), name, description);
        return res.redirect(`/plan-requests/${row.id}`);
    } catch (err) {
        console.error('createPlanRequest', err);
        return res.redirect('/plan-requests/new');
    }
};

const showPlanRequest = async (req, res) => {
    try {
        const row = await findByIdForTrainee(req.planRequestId, traineeId(req));
        if (!row) {
            return res.redirect('/plan-requests');
        }
        res.render('plan-requests/show', {
            title: row.name,
            planRequest: row
        });
    } catch (err) {
        console.error('showPlanRequest', err);
        res.redirect('/plan-requests');
    }
};

const editPlanRequestForm = async (req, res) => {
    try {
        const row = await findByIdForTrainee(req.planRequestId, traineeId(req));
        if (!row) {
            return res.redirect('/plan-requests');
        }
        res.render('plan-requests/edit', {
            title: 'Edit request',
            planRequest: row
        });
    } catch (err) {
        console.error('editPlanRequestForm', err);
        res.redirect('/plan-requests');
    }
};

const updatePlanRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Plan request validation:', errors.array());
        return res.redirect(`/plan-requests/${req.planRequestId}/edit`);
    }
    const { name, description } = req.body;
    try {
        const row = await updateOwnRequest(req.planRequestId, traineeId(req), name, description);
        if (!row) {
            return res.redirect('/plan-requests');
        }
        return res.redirect(`/plan-requests/${req.planRequestId}`);
    } catch (err) {
        console.error('updatePlanRequest', err);
        return res.redirect(`/plan-requests/${req.planRequestId}/edit`);
    }
};

const destroyPlanRequest = async (req, res) => {
    try {
        await deleteOwnRequest(req.planRequestId, traineeId(req));
    } catch (err) {
        console.error('destroyPlanRequest', err);
    }
    return res.redirect('/plan-requests');
};

router.get('/', listPlanRequests);
router.get('/new', newPlanRequestForm);
router.post('/', planRequestBodyValidation, createPlanRequest);

router.get('/:id', parseRequestId, showPlanRequest);
router.get('/:id/edit', parseRequestId, editPlanRequestForm);
router.post('/:id/update', parseRequestId, planRequestBodyValidation, updatePlanRequest);
router.post('/:id/delete', parseRequestId, destroyPlanRequest);

export default router;
