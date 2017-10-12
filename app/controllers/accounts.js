'use strict';

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
    const user = request.payload;
    this.users[user.email] = user;
    reply.redirect('/login');
  },

};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    if ((user.email in this.users) && (user.password === this.users[user.email].password)) {
      request.cookieAuth.set({
        loggedIn: true,
        loggedInUser: user.email,
      });
      reply.view('dashboard', { user: this.users[user.email] });
    } else {
      reply.redirect('/signup');
    }
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
    let user = this.users[request.auth.credentials.loggedInUser];
    reply.view('settings', { user: user });
  },
};
