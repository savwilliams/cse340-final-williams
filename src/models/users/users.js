import db from '../db.js';


const getAllUsers = async () => {
    const query = `
        SELECT 
        id, 
        name, 
        email, 
        role, 
        created_at
        FROM users
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const promoteTraineeToCoach = async (userId) => {
    const result = await db.query(
        `
        UPDATE users
        SET role = 'coach'
        WHERE id = $1 AND role = 'trainee'
        RETURNING id
        `,
        [userId]
    );
    return result.rowCount > 0;
};

export { getAllUsers, promoteTraineeToCoach };