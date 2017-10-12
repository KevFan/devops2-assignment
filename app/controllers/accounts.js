'use strict';

const User = require('../models/user');
const Joi = require('joi');

exports.home = {
  auth: false,
  handler: (request, reply) => {
    reply.view('main', { title: 'MyTweet | Home' });
  },

};

exports.signup = {
  auth: false,
  handler: (request, reply) => {
    reply.view('signup', { title: 'MyTweet | Sign Up' });
  },

};

exports.login = {
  auth: false,
  handler: (request, reply) => {
    reply.view('login', { title: 'MyTweet | Login' });
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

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
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
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: user.email,
        });
        reply.redirect('/home');
      } else {
        reply.redirect('/signup');
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
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
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
      User.findOne({ email: request.auth.credentials.loggedInUser }).then(user => {
        reply.view('settings', {
          title: 'Update settings error',
          user: user,
          errors: error.data.details,
        }).code(400);
      });
    },
  },

  handler: function (request, reply) {
    const loggedInUserEmail = request.auth.credentials.loggedInUser;
    const editedUser = request.payload;
    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  },
};
