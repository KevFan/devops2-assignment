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
