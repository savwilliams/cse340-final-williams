BEGIN;

--======== Create Tables ========
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('trainee','coach','admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coach-trainee assignments table
CREATE TABLE coach_trainees (
    id SERIAL PRIMARY KEY,
    coach_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trainee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (coach_id, trainee_id)
);

-- Exercises table
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
	description TEXT,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    trainee_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout exercises table
CREATE TABLE workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id),
    sets INT NOT NULL,
    reps INT NOT NULL,
    exercise_order INT,
    UNIQUE(workout_id, exercise_id, exercise_order)
);

-- Workout logs table
CREATE TABLE workout_logs (
    id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(id) ON DELETE SET NULL,
    trainee_id INT REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Exercise logs table
CREATE TABLE exercise_logs (
    id SERIAL PRIMARY KEY,
    workout_log_id INT REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id),
    sets_completed INT,
    reps_completed INT,
    weight NUMERIC(6,2)
);

-- Plan requests table 
CREATE TABLE plan_requests (
    id SERIAL PRIMARY KEY,
    trainee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coach_id INT REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    workout_plan TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted','in_progress','completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request notes table
CREATE TABLE request_notes (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES plan_requests(id) ON DELETE CASCADE,
    coach_id INT REFERENCES users(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--======== Insert Exercise Data ========

INSERT INTO exercises (name, description) VALUES
    ('Push-Up', 'Start in a plank position with hands under shoulders. Lower your chest toward the ground while keeping your body straight, then push back up.'),
    ('Pull-Up', 'Hang from a bar with palms facing away. Pull your body up until your chin is above the bar, then lower back down with control.'),
    ('Squat', 'Stand with feet shoulder-width apart. Lower your hips back and down while keeping your chest up, then return to standing.'),
    ('Lunge', 'Step forward with one leg and lower your hips until both knees are bent at about 90 degrees, then push back to standing.'),
    ('Deadlift', 'Stand with feet hip-width apart. Bend at hips and knees to grip the weight, keep your back straight, then stand up by extending your hips.'),
    ('Bench Press', 'Lie on a bench and grip the bar slightly wider than shoulder-width. Lower it to your chest, then press it back up until arms are straight.'),
    ('Overhead Press', 'Hold weights at shoulder height. Press them overhead until arms are fully extended, then lower back down slowly.'),
    ('Bicep Curl', 'Hold weights at your sides with palms facing forward. Curl the weights up toward your shoulders, then lower them back down.'),
    ('Tricep Dip', 'Place your hands behind you on a bench. Lower your body by bending your elbows, then push back up to straighten your arms.'),
    ('Plank', 'Hold your body in a straight line on your forearms and toes. Keep your core tight and avoid letting your hips sag.'),
    ('Mountain Climbers', 'Start in a plank position. Drive one knee toward your chest, then quickly switch legs in a running motion.'),
    ('Burpee', 'Start standing, drop into a squat, kick your feet back into a plank, perform a push-up, then jump up explosively.'),
    ('Leg Press', 'Sit on the machine with feet on the platform. Push the platform away by extending your legs, then slowly return.'),
    ('Lat Pulldown', 'Sit at the machine and grip the bar wider than shoulders. Pull the bar down to your chest, then slowly release it back up.'),
    ('Russian Twist', 'Sit with knees bent and lean back slightly. Rotate your torso side to side while holding a weight or clasping hands.'),
    ('Glute Bridge', 'Lie on your back with knees bent. Push through your heels to lift your hips, then lower them back down.'),
    ('Calf Raise', 'Stand upright and push through the balls of your feet to raise your heels, then lower them slowly.'),
    ('Hammer Curl', 'Hold weights with palms facing inward. Curl them up while keeping palms facing each other, then lower slowly.'),
    ('Lateral Raise', 'Hold weights at your sides. Raise your arms out to the sides until shoulder height, then lower them slowly.'),
    ('Crunch', 'Lie on your back with knees bent. Lift your shoulders off the ground by engaging your core, then lower back down.');

COMMIT;
