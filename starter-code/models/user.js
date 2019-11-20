'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['Boss','Developer', 'TA'],
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);


module.exports = User;
