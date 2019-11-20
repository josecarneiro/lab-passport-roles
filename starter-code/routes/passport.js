'use strict';

const {
  Router
} = require('express');
const passportRouter = Router();

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

const passport = require("passport");

const ensureLogin = require('connect-ensure-login');


// --- PASSPORT ROUTERS

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

passportRouter.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

// ---- BOSS ROUTERS ---- //Need to pass this to other .js document

//Here the boss is able to access his private page and add/edit/delete users
passportRouter.get(
  '/boss-page',
  ensureLogin.ensureLoggedIn('/'),
  (req, res, next) => {
    if (req.user && req.user.role === 'Boss') {
      User.find()
        .then(users => {
          res.render('passport/boss-page', {
            users
          });
        })
        .catch(err => {
          next(err);
          console.log('there was an error connecting the users to the page');
        });
    } else {
      next(new Error('has no permission to visit this page'))
    }
  }
);

//Here the boss will add a new user to the database
passportRouter.post('/boss-page',
  (req, res, next) => {
    const {
      username,
      password,
      role
    } = req.body;
    bcryptjs
      .hash(password, 10)
      .then(hash => {
        return User.create({
          username: username,
          passwordHash: hash,
          role: role
        });
      })
      .then(user => {
        req.session.user = user._id;
        res.redirect('/');
      })
      .catch(error => {
        next(error);
      });
  });

/*passport.authenticate('add-user', {
  successRedirect: '/',
  failureRedirect: '/'
})*/

//Here the boss is able to delete users
passportRouter.post('/users/:user_id/delete', ensureLogin.ensureLoggedIn('/'),
  (req, res, next) => {
    if (req.user && req.user.role === 'Boss') {
      const userId = req.params.user_id;
      User.findByIdAndDelete(userId)
        .then(() => {
          console.log('The user was deleted');
          res.redirect('/boss-page');
        })
        .catch((err) => {
          console.log('Couldnt delete user');
          next(err);
        });
    } else {
      next(new Error('has no permission to visit this page'));
    }
  });


//Here the boss is able to edit users
passportRouter.post('/users/:user_id/edit', (req, res, next) => {
  const userId = req.params.user_id;

  User.findByIdAndUpdate(userId, {
      username: req.body.username,
      role: req.body.role,
    })
    .then((user) => {
      console.log('this user was editer');
      res.redirect('/boss-page');
    })
    .catch((err) => {
      console.log('It was not possible to edit the user');
      next(err);
    });
});






module.exports = passportRouter;