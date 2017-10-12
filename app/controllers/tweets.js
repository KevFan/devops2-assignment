'use strict';
const User = require('../models/user');

exports.home = {

  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('dashboard', { title: 'Tweet | Dashboard', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

