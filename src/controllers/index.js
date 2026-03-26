/**
 * Controllers
 */

const homePage = (req, res) => {
  res.render('home', {
    title: 'Workout Tracker',
    bodyClass: 'home-page'
  });
};

export { homePage };
