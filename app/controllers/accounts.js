'use strict';

const User = require('../models/user');
const Admin = require('../models/admin');
const Joi = require('joi');

exports.home = {
  auth: false,
  handler: (request, reply) => {
    reply.view('main', {title: 'MyTweet | Home'});
  },

};

exports.signup = {
  auth: false,
  handler: (request, reply) => {
    reply.view('signup', {title: 'MyTweet | Sign Up'});
  },

};

exports.login = {
  auth: false,
  handler: (request, reply) => {
    reply.view('login', {title: 'MyTweet | Login'});
  },

};

exports.register = {
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);
    const userRole = request.params.role;

    user.save().then(newUser => {
      console.log(newUser);
      if (userRole === 'user') {
        reply.redirect('/login');
      } else if (userRole === 'admin') {
        reply.redirect('/admin');
      }
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },

};

exports.authenticate = {
  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },

  },

  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({email: user.email}).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: foundUser._id,
        });
        reply.redirect('/home');
      } else {
        Admin.findOne({email: user.email}).then(foundAdmin => {
          if (foundAdmin && foundAdmin.password === user.password) {
            request.cookieAuth.set({
              loggedIn: true,
              loggedInUser: foundAdmin._id,
            });
            reply.redirect('/admin');
          } else {
            reply.redirect('/signup');
          }
        });
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

exports.viewSettings = {

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    User.findOne({_id: userId}).then(foundUser => {
      if (!foundUser) {
        Admin.findOne({_id: userId}).then(foundAdmin => {
          reply.view('settings', {title: 'Edit Account Settings', user: foundAdmin, isAdmin: true});
        });
      } else {
        reply.view('settings', {title: 'Edit Account Settings', user: foundUser});
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.updateSettings = {
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      // Promise to find user to correctly render settings view with user details on failed form
      // validation
      User.findOne({_id: request.auth.credentials.loggedInUser}).then(user => {
        if (!user) {
          Admin.findOne({_id: request.auth.credentials.loggedInUser}).then(admin => {
            reply.view('settings', {
              title: 'Update settings error',
              user: admin,
              isAdmin: true,
              errors: error.data.details,
            }).code(400);
          });
        } else {
          reply.view('settings', {
            title: 'Update settings error',
            user: user,
            errors: error.data.details,
          }).code(400);
        }
      });
    },
  },

  handler: function (request, reply) {
    const loggedInUserId = request.auth.credentials.loggedInUser;
    const editedUser = request.payload;
    User.findOne({_id: loggedInUserId}).then(user => {
      if (user) {
        user.firstName = editedUser.firstName;
        user.lastName = editedUser.lastName;
        user.email = editedUser.email;
        user.password = editedUser.password;
        return user.save();
      } else {
        throw error;
      }
    }).then(user => {
      reply.view('settings', {title: 'Edit Account Settings', user: user});
    }).catch(err => {
      Admin.findOne({_id: loggedInUserId}).then(admin => {
        admin.firstName = editedUser.firstName;
        admin.lastName = editedUser.lastName;
        admin.email = editedUser.email;
        admin.password = editedUser.password;
        return admin.save();
      }).then(admin => {
        reply.view('settings', {title: 'Edit Account Settings', user: admin, isAdmin: true});
      }).catch(err => {
        console.log('no user or admin with id: ' + loggedInUserId);
        reply.redirect('/');
      });
    });
  },
};
