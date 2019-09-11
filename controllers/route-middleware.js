'use strict';

const routeGuardMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

const routeRoleMiddleware = allowedRoles => {
  return (req, res, next) => {
    req.session.user = req.session.user || {};
    const role = req.session.user.role;
    if (!allowedRoles.includes(role)) {
      next(new Error('User is not permitted to view this page.'));
      return;
    }
    next();
  };
};

module.exports = { routeGuardMiddleware, routeRoleMiddleware };