'use strict'

const bcrypt = require('bcryptjs');

const localSignup = function(username, password, role='user') {
  const Model = this;

  return Model.findOne({ username })
    .then(user => {
      if (user) {
        throw new Error('USER_ALREADY_EXISTS');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then(hash => {
      return Model.create({
        username,
        passwordHash: hash,
        role
      });
    })
    .then(user => {
      return Promise.resolve(user);
    })
    .catch(error => {
      console.log(`Error signing up: ${error}`);
      return Promise.reject(error);
    });
};

module.exports = localSignup;