'use strict';

const { Router } = require('express');
const router = Router();

const passport = require('passport');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'I.B.I.' });
});

router.get('/login', (req, res, next) => {
  res.render('login');
})
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/user',
  failureRedirect: '/login'
}));
router.post('/signout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;
