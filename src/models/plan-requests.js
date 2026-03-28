import db from './db.js';

const listByTraineeId = async (traineeId) => {
    const query = `
        SELECT id, trainee_id, coach_id, name, description, workout_plan, status, created_at, updated_at
        FROM plan_requests
        WHERE trainee_id = $1
        ORDER BY created_at DESC
    `;
    const result = await db.query(query, [traineeId]);
    return result.rows;
};


const findByIdForTrainee = async (requestId, traineeId) => {
    const query = `
        SELECT id, trainee_id, coach_id, name, description, workout_plan, status, created_at, updated_at
        FROM plan_requests
        WHERE id = $1 AND trainee_id = $2
        LIMIT 1
    `;
    const result = await db.query(query, [requestId, traineeId]);
    return result.rows[0] || null;
};


const createRequest = async (traineeId, name, description) => {
    const query = `
        INSERT INTO plan_requests (trainee_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING id, trainee_id, coach_id, name, description, workout_plan, status, created_at, updated_at
    `;
    const result = await db.query(query, [traineeId, name, description || null]);
    return result.rows[0];
};


const updateOwnRequest = async (requestId, traineeId, name, description) => {
    const query = `
        UPDATE plan_requests
        SET name = $1,
            description = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND trainee_id = $4
        RETURNING id, trainee_id, coach_id, name, description, workout_plan, status, created_at, updated_at
    `;
    const result = await db.query(query, [name, description || null, requestId, traineeId]);
    return result.rows[0] || null;
};


const deleteOwnRequest = async (requestId, traineeId) => {
    const query = `
        DELETE FROM plan_requests
        WHERE id = $1 AND trainee_id = $2
    `;
    const result = await db.query(query, [requestId, traineeId]);
    return result.rowCount > 0;
};

export {
    listByTraineeId,
    findByIdForTrainee,
    createRequest,
    updateOwnRequest,
    deleteOwnRequest
};
