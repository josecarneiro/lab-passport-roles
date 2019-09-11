'use strict';

const { routeGuardMiddleware, routeRoleMiddleware } = require('./../controllers/route-middleware');
const User = require('./../models/user');

const { Router } = require('express');
const router = Router();

const passport = require('passport');

router.get('/', routeGuardMiddleware, (req, res, next) => {
  // User information is being passed in cookie form
  res.locals.bossButtons = (req.user.role === 'boss');
  res.locals.taButtons = (req.user.role === 'ta');
  res.locals.developerButtons = (req.user.role === 'developer');
  res.render('user');
});

router.get('/admin/register', routeRoleMiddleware(['boss']), (req, res, next) => {
  res.render('register');
});
router.post('/admin/register', routeRoleMiddleware(['boss']), (req, res, next) => {
  // Get request body
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  User.signUp(username, password, role)
    .then((user) => {
      console.log('user created', user)
      res.render('/');
    })
    .catch((err) => {
      console.log('ERROR', err)
    });
});

module.exports = router;
