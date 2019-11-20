'use strict';

const {
  Router
} = require('express');
const passportRouter = Router();

// Require user model
// Add bcrypt to encrypt passwords
// Add passport
const passport = require("passport");

const ensureLogin = require('connect-ensure-login');

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post('/signup',
  passport.authenticate('signup', {
    successRedirect: '/private-page',
    failureRedirect: '/'
  }));

  passportRouter.get("/login", (req, res, next) => {
    res.render("passport/login");
  });
  
  passportRouter.post('/login',
    passport.authenticate('login', {
      successRedirect: '/private-page',
      failureRedirect: '/'
    }));

passportRouter.get(
  '/private-page',
  ensureLogin.ensureLoggedIn('/'),
  (req, res, next) => {
    const user = req.user;
    if (req.user) {
      res.render('passport/private', {
        user
      });
    } else {
      next(new Error('has no permission to visit this page'))
  }
}
);

passportRouter.get(
  '/boss-page',
  ensureLogin.ensureLoggedIn('/'),
  (req, res, next) => {
    if (req.user  && req.user.role === 'Boss') {
      res.render('passport/boss-page');
    } else {
      next(new Error('has no permission to visit this page'))
  }
}
)

passportRouter.post('/boss-page',
passport.authenticate('add-user', {
  successRedirect: '/',
  failureRedirect: '/'
})
);

passportRouter.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = passportRouter;