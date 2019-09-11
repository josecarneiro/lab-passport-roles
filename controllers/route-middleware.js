'use strict';

const routeGuardMiddleware = (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

const routeRoleMiddleware = allowedRoles => {
  return (req, res, next) => {
    req.user = req.user || {};
    const role = req.user.role;
    if (!allowedRoles.includes(role)) {
      next(new Error('User is not permitted to view this page.'));
      return;
    }
    next();
  };
};

module.exports = { routeGuardMiddleware, routeRoleMiddleware };