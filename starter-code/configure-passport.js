// Passport configuration

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");
const bcryptjs = require("bcryptjs");

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  "signup",
  new LocalStrategy((username, password, callback) => {
    bcryptjs
      .hash(password, 10)
      .then(hash => {
        return User.create({
          username,
          passwordHash: hash
        });
      })
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        // ...
        callback(error);
      });
  })
);

passport.use(
  "signin",
  new LocalStrategy((username, password, callback) => {
    let user;
    User.findOne({
      username
    })
      .then(document => {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then(passwordMatchesHash => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error("Passwords dont match"));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);
