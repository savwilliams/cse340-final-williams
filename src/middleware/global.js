/**
 * Nav: redirect to the correct dashboard based on the user's role
 */
const dashboardPathForRole = (role) => {
    switch (role) {
        case 'admin':
            return '/admin-dashboard';
        case 'coach':
            return '/coach-dashboard';
        default:
            return '/dashboard';
    }
};

/**
 * Helper: get a greeting based on current time.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning!';
    if (currentHour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
};

const addLocalVariables = (req, res, next) => {
    // Set current year for use in templates
    res.locals.currentYear = new Date().getFullYear();

    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Make req.query available to all templates
    res.locals.queryParams = { ...req.query };

    // Set greeting based on time of day
    res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;

    res.locals.isLoggedIn = false;
    res.locals.dashboardPath = null;
    res.locals.planRequestsPath = null;
    res.locals.coachPlanRequestsPath = null;
    res.locals.manageUsersPath = null;
    res.locals.adminPlanRequestsPath = null;
    res.locals.manageExercisesPath = null;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        const role = req.session.user.role;
        res.locals.dashboardPath = dashboardPathForRole(role);
        if (role === 'trainee') {
            res.locals.planRequestsPath = '/plan-requests';
        }
        if (role === 'coach') {
            res.locals.coachPlanRequestsPath = '/coach/plan-requests';
        }
        if (role === 'admin') {
            res.locals.manageUsersPath = '/admin/users';
            res.locals.adminPlanRequestsPath = '/admin/plan-requests';
            res.locals.manageExercisesPath = '/admin/exercises';
        }
    }
    next();
};

export { addLocalVariables };