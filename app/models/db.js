'use strict';

/**
 * Object to connect and seed mongodb database
 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/mytweet';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);

  // In a non-production environment - seed the database from data.json
  if (process.env.NODE_ENV !== 'production') {
    const seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const User = require('./user');
    const Tweet = require('./tweet');
    const Admin = require('./admin');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');
      console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
});
