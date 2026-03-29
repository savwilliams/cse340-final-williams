import db from '../db.js';

const getAllExercises = async () => {
    const query = `
        SELECT id, name, description
        FROM exercises
        ORDER BY name ASC
    `;
    const result = await db.query(query);
    return result.rows;
};

const createExercise = async (name, description) => {
    const query = `
        INSERT INTO exercises (name, description)
        VALUES ($1, $2)
        RETURNING id
    `;
    const result = await db.query(query, [name, description]);
    return result.rows[0];
};

const updateExercise = async (id, name, description) => {
    const query = `
        UPDATE exercises
        SET name = $1, description = $2
        WHERE id = $3
    `;
    const result = await db.query(query, [name, description, id]);
    return result.rowCount > 0;
};

const deleteExercise = async (id) => {
    const query = `
        DELETE FROM exercises
        WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

export { getAllExercises, createExercise, updateExercise, deleteExercise };
