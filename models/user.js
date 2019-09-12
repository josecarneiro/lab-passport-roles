'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: [ 'Boss', 'Developer', 'TA' ],
    default: 'user'
  }
});

const signInStatic = require('./user-sign-in-static');
const signUpStatic = require('./user-sign-up-static');

schema.statics.signIn = signInStatic;
schema.statics.signUp = signUpStatic;


const User = mongoose.model('User', schema);

module.exports = User;
