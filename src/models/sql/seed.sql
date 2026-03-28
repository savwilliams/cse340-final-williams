-- Database seed file for Workout Tracker 
-- This file creates tables and inserts all initial data

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


--======== Insert Data ========
COMMIT;
