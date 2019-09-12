'use strict';

const { routeLoggedInMiddleware, routeRoleMiddleware } = require('./../controllers/route-middleware');
const User = require('./../models/user');

const { Router } = require('express');
const router = Router();

// If nothing else is passed, render the user's own page
router.get('/', routeLoggedInMiddleware, (req, res, next) => {
  // User information is being passed in cookie form
  res.render('user');
});
// If a username is passed, render that user's profile (name and role)
router.get('/:username', routeLoggedInMiddleware, (req, res, next) => {
  const username = req.params.username;
  User.findOne({username})
    .then(user => {
      res.render('user', {
        viewingUser: true,
        theirUsername: user.username,
        theirRole: user.role
      });
    })
    .catch(err => {
      res.render('user', {errorMessage: err});
    });
});

// Registration page (for admins only)
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
      console.log('user created', user);
      res.render('register', {message: `User ${username} successfully created.`});
    })
    .catch((err) => {
      res.render('register', {errorMessage: err});
    });
});

// User removal
router.get('/admin/remove', routeRoleMiddleware(['boss']), (req, res, next) => {
  res.render('remove');
});
router.post('/admin/remove', routeRoleMiddleware(['boss']), (req, res, next) => {
  // Get request body
  const username = req.body.username;
  User.findOne({username})
    .then((user) => {
      if (!user) {throw new Error('USER_NOT_FOUND');}
      else {
        return User.findOneAndDelete({username});
      }
    })
    .then(() => {
      res.render('remove', {message: "User successfully removed."});
    })
    .catch(err => {
      res.render('remove', {errorMessage: err});
    });
});

// Edit roles
router.get('/admin/roles', routeRoleMiddleware(['boss']), (req, res, next) => {
  res.render('editrole');
});
router.post('/admin/roles', routeRoleMiddleware(['boss']), (req, res, next) => {
  const username = req.body.username;
  const newRole = req.body.role;
  User.findOne({username})
    .then((user) => {
      if (!user) {throw new Error('USER NOT FOUND');}
      else {
        return User.updateOne({username}, {role: newRole});
      }
    })
    .then(() => {
      res.render('editrole', {message: `User ${username} successfully given ${newRole.toUpperCase()} role.`});
    })
    .catch(err => {
      res.render('editrole', {errorMessage: err});
    });
});

module.exports = router;
