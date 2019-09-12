'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');

//---------- passport const --------------------------------------

const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;
const authenticationRouter = require('./routes/index');
const restrictedRouter = require('./routes/restricted');


//----------------------------------------------------------------

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

const app = express();
const hbs = require('hbs');

// Setup view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');



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

// PASSPORT CONFIGURATION ------------------------------------------------------------------------------------

const User = require('./models/user');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        callback(new Error('MISSING_USER'));
      } else {
        callback(null, user);
      }
    })
    .catch(error => {
      callback(error);
    });
});

passport.use('sign-in', new PassportLocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
  User.signIn(email, password)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
}));

passport.use('sign-up', new PassportLocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
  User.signUp(email, password)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
}));

app.use(passport.initialize());
app.use(passport.session());

// END PASSPORT CONFIGURATION

// Custom piece of middleware
app.use((req, res, next) => {
  // Access user information from within my templates
  res.locals.user = req.user;
  // Keep going to the next middleware or route handler
  next();
});

const routeGuardMiddleware = require('./controllers/route-role-guard-middleware');

app.use('/', indexRouter);
app.use('/authentication', authenticationRouter);
app.use('/restricted', routeGuardMiddleware, restrictedRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  if (req.app.get('env') === 'development') console.log(error);

  res.status(error.status || 500);
  res.render('error');
});



// PASSPORT CONFIGURATION ------------------------------------------------------------------------------------


module.exports = app;
