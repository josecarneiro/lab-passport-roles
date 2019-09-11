'use strict';
require('dotenv').config();
const User = require('./../models/user');
const db = require('./database')

db.connect({ uri: process.env.MONGODB_URI })
  .then(() => {
    return User.deleteMany({});
  })
  .then(() => {
    return User.signUp('BigBoss', 'password1', 'boss');
  })
  .then(() => {
    console.log('Database successfully deleted and re-seeded')
    db.disconnect();
  })
  .catch((error) => {
    console.log('An error happened while re-seeding the database:', error)
    process.exit(1);
  })