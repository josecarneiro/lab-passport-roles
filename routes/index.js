'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const routeGuardMiddleware = require('./../controllers/route-role-guard-middleware');

router.get('/', (req, res, next) => {
  res.render('index');
});




router.post('/sign-in', passport.authenticate('sign-in', {
  successRedirect: "/authentication/private",
  failureRedirect: "/authentication/sign-in"
}));

router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('private');
});



module.exports = router;
