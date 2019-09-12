'use strict';

const { Router } = require('express');
const router = Router();
const routeRoleGuardMiddleware = require('./../controllers/route-role-guard-middleware');

router.get('/Boss', routeRoleGuardMiddleware([ 'user', 'editor', 'admin' ]), (req, res, next) => {
  res.render('restricted', { title: 'This is a user restricted view!' });
});

router.get('/Dev', routeRoleGuardMiddleware([ 'editor', 'admin' ]), (req, res, next) => {
  res.render('restricted', { title: 'This is a editor restricted view!' });
});

router.get('/TA', routeRoleGuardMiddleware([ 'admin' ]), (req, res, next) => {
  res.render('restricted', { title: 'This is a admin restricted view!' });
});

module.exports = router;