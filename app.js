'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');

// Additional packages we require
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

const app = express();

// Setup view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(express.static(join(__dirname, 'public')));
app.use(sassMiddleware({
  src: join(__dirname, 'public'),
  dest: join(__dirname, 'public'),
  outputStyle: process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
  sourceMap: true
}));

// Set up express-session
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60 * 60 * 24 * 1000 },
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));

// PASSPORT CONFIGURATION
/*
  1. Tell passport how to serialize and deserialize data
     Serialize: how we take data from user object and save in the session
     Deserialize: how we take value from session and use it to access user object
  2. Tell passport which strategy we're using for login and for signup
  3. Install as middleware
  4. Tell app which routes to use for each strategy
*/

const User = require('./models/user');

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

passport.use('local-signin', new PassportLocalStrategy((username, password, callback) => {
  User.signIn(username, password)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
}));

// passport.use('local-signup', new PassportLocalStrategy((username, password, callback) => {
//   User.signUp(username, password)
//     .then(user => {
//       callback(null, user);
//     })
//     .catch(error => {
//       callback(error);
//     });
// }));

app.use(passport.initialize());
app.use(passport.session());
/* END PASSPORT CONFIGURATION */

// Custom piece of middleware
app.use((req, res, next) => {
  // Access user information from within my templates
  res.locals.user = req.user;
  // User information is being passed in cookie form
  req.user = req.user || {};
  res.locals.bossButtons = (req.user.role === 'boss');
  res.locals.taButtons = (req.user.role === 'ta');
  res.locals.developerButtons = (req.user.role === 'developer');
  // Keep going to the next middleware or route handler
  next();
});


app.use('/', indexRouter);
app.use('/user', usersRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
