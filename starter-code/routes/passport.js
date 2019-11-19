"use strict";

const { Router } = require("express");
const passportRouter = Router();
// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/",
    failureRedirect: "/authentication/signup"
  })
);

passportRouter.get("/signin", (req, res, next) => {
  res.render("passport/signin");
});

passportRouter.post(
  "/signin",
  passport.authenticate("signin", {
    successRedirect: "/",
    failureRedirect: "/authentication/signin"
  })
);

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

/* passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const user = req.user;
    res.render("passport/private", {
      user
    });
  }
); */

module.exports = passportRouter;
