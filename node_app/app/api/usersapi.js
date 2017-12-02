'use strict';

const User = require('../models/user');
const Boom = require('boom');

/**
 * Find all users
 */
exports.find = {
  auth: false,

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/**
 * Find one user by id
 */
exports.findOne = {
  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      reply(user);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Create a user
 */
exports.create = {
  auth: false,

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating user'));
    });
  },
};

/**
 * Delete all users
 */
exports.deleteAll = {
  auth: false,

  handler: function (request, reply) {
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing users'));
    });
  },
};

/**
 * Delete one user by id
 */
exports.deleteOne = {
  auth: false,

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Update a user by id
 */
exports.update = {
  auth: false,

  handler: function (request, reply) {
    User.findOneAndUpdate({ _id: request.params.id }, request.payload, { new: true }).then(user => {
      reply(user).code(200);
    }).catch(err => {
      reply(Boom.notFound('error updating user'));
    });
  },
};
