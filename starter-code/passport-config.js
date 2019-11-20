const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('./models/user');
const bcryptjs = require('bcryptjs');

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
    'signup',
    new LocalStrategy({
        usernameField: 'username',
        roleField: 'role',
        passReqToCallback: true,
    }, (req, username, password, callback) => {
        bcryptjs
            .hash(password, 10)
            .then(hash => {
                return User.create({
                    username,
                    role: req.body.role,
                    passwordHash: hash
                });
            })
            .then(user => {
                callback(null, user);
                console.log('the user was created', user)
            })
            .catch(error => {
                callback(error);
            });
    })
);

passport.use(
    'login',
    new LocalStrategy({
        usernameField: 'username'
    }, (username, password, callback) => {
        let user;
        User.findOne({
                username
            })
            .then(document => {
                console.log('this is the user I found', document)
                user = document;
                return bcryptjs.compare(password, user.passwordHash);
            })
            .then(passwordMatches => {
                if (passwordMatches) {
                    callback(null, user);
                } else {
                    callback(new Error('Password doesnt match'));
                }
            })
            .catch(error => {
                callback(error);
            });
    })
);

passport.use(
    'add-user',
    new LocalStrategy({
        usernameField: 'username',
        roleField: 'role',
        passReqToCallback: true,
    }, (req, username, password, callback) => {
        bcryptjs
            .hash(password, 10)
            .then(hash => {
                return User.create({
                    username,
                    role: req.body.role,
                    passwordHash: hash
                });
            })
            .then(user => {
                callback(null, user);
                console.log('the user was created', user)
            })
            .catch(error => {
                callback(error);
            });
    })
);