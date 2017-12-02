'use strict';

const Admin = require('../models/admin');
const Boom = require('boom');

/**
 * Find all admins
 */
exports.find = {
  auth: false,

  handler: function (request, reply) {
    Admin.find({}).exec().then(admins => {
      reply(admins);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/**
 * Find one admin by id
 */
exports.findOne = {
  auth: false,

  handler: function (request, reply) {
    Admin.findOne({ _id: request.params.id }).then(admin => {
      reply(admin);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Create an admin
 */
exports.create = {
  auth: false,

  handler: function (request, reply) {
    const admin = new Admin(request.payload);
    admin.save().then(newAdmin => {
      reply(newAdmin).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating admin'));
    });
  },
};

/**
 * Delete all admins
 */
exports.deleteAll = {
  auth: false,

  handler: function (request, reply) {
    Admin.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing admins'));
    });
  },
};

/**
 * Delete one admin by id
 */
exports.deleteOne = {
  auth: false,

  handler: function (request, reply) {
    Admin.remove({ _id: request.params.id }).then(admin => {
      reply(admin).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Update an admin by id
 */
exports.update = {
  auth: false,

  handler: function (request, reply) {
    Admin.findOneAndUpdate({ _id: request.params.id }, request.payload, { new: true }).then(admin => {
      reply(admin).code(200);
    }).catch(err => {
      reply(Boom.notFound('error updating admin'));
    });
  },
};
