'use strict';

const mongoose = require('mongoose');

// User model goes here
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    required: false,
    enum: [ 'boss', 'developer', 'ta', 'user' ],
    default: 'user'
  }
});

schema.statics = schema.statics || {};
schema.statics.signIn = require('./model-local-signin');
schema.statics.signUp = require('./model-local-signup');

const User = mongoose.model('User', schema);

module.exports = User;