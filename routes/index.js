'use strict';

const { Router } = require('express');
const router = Router();

const User = require('./../models/user');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'I.B.I.' });
});

router.get('/login', (req, res, next) => {
  res.render('login');
})
router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // Find user by username (guaranteed to be unique)
  User.signIn(username, password)
    .then(user => {
      // Set cookie
      req.session.user = {role: user.role, _id: user._id, username: user.username};
      // Redirect
      res.redirect('/user');
    })
    .catch(err => {
      res.render('login', {errorMessage: err.message});
    })
})



// router.post('/login', passport.authenticate('local-signin', {
//   successRedirect: '/user',
//   failureRedirect: '/login'
// }));
router.post('/signout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
