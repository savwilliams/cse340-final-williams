import { Router } from 'express';
import { validationResult } from 'express-validator';
import { listByTraineeId, findByIdForTrainee, createRequest, updateOwnRequest, deleteOwnRequest, listAllPlanRequests, findPlanRequestById, deletePlanRequestByAdmin, updatePlanRequest as updatePlanRequestInDb } from '../../models/planRequests/planRequests.js';
import { planRequestBodyValidation, planRequestUpdateValidation } from '../../middleware/validation/planRequests.js';
import { requireRole } from '../../middleware/auth.js';

const router = Router();

// =======================
// Helpers
// =======================

const userId = (req) => req.session.user.id;

// =======================
// Wrap async Express handlers - reduces repetative try/catch blocks
// =======================
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error('[planRequests]', err);
        next(err);
    });
};

// =======================
// Trainee handlers
// =======================

const listPlanRequests = async (req, res) => {
    const rows = await listByTraineeId(userId(req));
    res.render('planRequests/trainee/list', {
        title: 'My plan requests',
        requests: rows
    });
};

const newPlanRequestForm = (req, res) => {
    res.render('planRequests/trainee/new', {
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
    const row = await createRequest(userId(req), name, description);
    return res.redirect(`/plan-requests/${row.id}`);
};

const showPlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/plan-requests');
    }
    const row = await findByIdForTrainee(planRequestId, userId(req));
    if (!row) {
        return res.redirect('/plan-requests');
    }
    res.render('planRequests/trainee/detail', {
        title: row.name,
        planRequest: row
    });
};

const editPlanRequestForm = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/plan-requests');
    }
    const row = await findByIdForTrainee(planRequestId, userId(req));
    if (!row) {
        return res.redirect('/plan-requests');
    }
    res.render('planRequests/trainee/edit', {
        title: 'Edit request',
        planRequest: row
    });
};

const updateTraineePlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/plan-requests');
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Plan request validation:', errors.array());
        return res.redirect(`/plan-requests/${req.params.id}/edit`);
    }
    const { name, description } = req.body;
    const row = await updateOwnRequest(planRequestId, userId(req), name, description);
    if (!row) {
        return res.redirect('/plan-requests');
    }
    return res.redirect(`/plan-requests/${planRequestId}`);
};

const destroyPlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/plan-requests');
    }
    await deleteOwnRequest(planRequestId, userId(req));
    return res.redirect('/plan-requests');
};

// =======================
// Coach handlers
// =======================

const listCoachPlanRequests = async (req, res) => {
    const rows = await listAllPlanRequests();
    res.render('planRequests/coach/list', {
        title: 'Trainee plan requests',
        requests: rows
    });
};

const showCoachPlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/coach/plan-requests');
    }
    const row = await findPlanRequestById(planRequestId);
    if (!row) {
        return res.redirect('/coach/plan-requests');
    }
    res.render('planRequests/coach/detail', {
        title: `Request #${row.id}`,
        planRequest: row
    });
};

const saveCoachPlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/coach/plan-requests');
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Coach plan request validation:', errors.array());
        return res.redirect(`/coach/plan-requests/${req.params.id}`);
    }
    const { workout_plan: workoutPlan, status } = req.body;
    const row = await updatePlanRequestInDb(
        planRequestId,
        userId(req),
        workoutPlan ?? '',
        status
    );
    if (!row) {
        return res.redirect('/coach/plan-requests');
    }
    return res.redirect(`/coach/plan-requests/${planRequestId}`);
};

// =======================
// Admin 
// =======================

const listAdminPlanRequests = async (req, res) => {
    const rows = await listAllPlanRequests();
    res.render('planRequests/admin/list', {
        title: 'Plan requests',
        requests: rows
    });
};

const showAdminPlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/admin/plan-requests');
    }
    const row = await findPlanRequestById(planRequestId);
    if (!row) {
        return res.redirect('/admin/plan-requests');
    }
    res.render('planRequests/admin/detail', {
        title: row.name,
        planRequest: row
    });
};

const destroyAdminPlanRequest = async (req, res) => {
    const planRequestId = parseInt(req.params.id);
    if (Number.isNaN(planRequestId) || planRequestId < 1) {
        return res.redirect('/admin/plan-requests');
    }
    await deletePlanRequestByAdmin(planRequestId);
    res.redirect('/admin/plan-requests');
};

// =======================
// Routes
// =======================

router.get('/plan-requests', requireRole('trainee'), asyncHandler(listPlanRequests));
router.get('/plan-requests/new', requireRole('trainee'), newPlanRequestForm);
router.post('/plan-requests', requireRole('trainee'), planRequestBodyValidation, asyncHandler(createPlanRequest));
router.get('/plan-requests/:id/edit', requireRole('trainee'), asyncHandler(editPlanRequestForm));
router.get('/plan-requests/:id', requireRole('trainee'), asyncHandler(showPlanRequest));
router.post('/plan-requests/:id/update', requireRole('trainee'), planRequestBodyValidation, asyncHandler(updateTraineePlanRequest));
router.post('/plan-requests/:id/delete', requireRole('trainee'), asyncHandler(destroyPlanRequest));

router.get('/coach/plan-requests', requireRole('coach'), asyncHandler(listCoachPlanRequests));
router.get('/coach/plan-requests/:id', requireRole('coach'), asyncHandler(showCoachPlanRequest));
router.post('/coach/plan-requests/:id/update', requireRole('coach'), planRequestUpdateValidation, asyncHandler(saveCoachPlanRequest));

router.get('/admin/plan-requests', requireRole('admin'), asyncHandler(listAdminPlanRequests));
router.get('/admin/plan-requests/:id', requireRole('admin'), asyncHandler(showAdminPlanRequest));
router.post('/admin/plan-requests/:id/delete', requireRole('admin'), asyncHandler(destroyAdminPlanRequest));

export default router;
