'use strict';

const Admin = require('../models/admin');
const Boom = require('boom');

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
