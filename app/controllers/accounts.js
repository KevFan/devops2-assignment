'use strict';

exports.home = {

  handler: (request, reply) => {
    reply.view('main', { title: 'MyTweet | Home' });
  },

};

exports.signup = {

  handler: (request, reply) => {
    reply.view('signup', { title: 'MyTweet | Sign Up' });
  },

};

exports.login = {

  handler: (request, reply) => {
    reply.view('login', { title: 'MyTweet | Login' });
  },

};

exports.register = {

  handler: function (request, reply) {
    reply.redirect('/home');
  },

};

exports.authenticate = {

  handler: function (request, reply) {
    reply.redirect('/home');
  },

};

exports.logout = {

  handler: function (request, reply) {
    reply.redirect('/');
  },
};

exports.viewSettings = {

  handler: function (request, reply) {
    reply.view('settings');
  },
};
