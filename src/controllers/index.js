/**
 * Controllers
 */

const homePage = (req, res) => {
  res.render('home', {
    title: 'Workout Tracker',
    bodyClass: 'home-page'
  });
};

const loginForm = (req, res) => {
  res.render('forms/login/form', {
    title: 'Login'
  });
};

const registerForm = (req, res) => {
  res.render('forms/register/form', {
    title: 'Register'
  });
};

export { homePage, loginForm, registerForm };
