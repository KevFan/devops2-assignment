'use strict';

const User = require('../models/user');

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
