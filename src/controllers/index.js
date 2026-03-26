/**
 * Controllers
 */

const homePage = (req, res) => {
  res.render('home', {
    title: 'Workout Tracker',
    bodyClass: 'home-page'
  });
};


const registerForm = (req, res) => {
  res.render('forms/register/form', {
    title: 'Register'
  });
};

export { homePage, registerForm };
